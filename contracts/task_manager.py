import smartpy as sp

TokenUtils = sp.io.import_script_from_url("file:utils/token.py")
Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")
FA12 = sp.io.import_script_from_url("file:helpers/tokens/fa12.py").FA12
SizzlerManagerDummy = sp.io.import_script_from_url("file:helpers/dummy/sizzler_manager_dummy.py").SizzlerManagerDummy
MinterDummy = sp.io.import_script_from_url("file:helpers/dummy/minter_dummy.py").MinterDummy


class Types:
    TASK = sp.TRecord(
        entrypoint=sp.TString,
        metadata=sp.TString,
        owner=sp.TAddress,
        tip=sp.TNat,
        credits=sp.TNat,
    ).layout(("entrypoint", ("metadata", ("owner", ("tip", "credits")))))

    ADD_TASK_PARAMS = sp.TRecord(
        contract=sp.TAddress,
        entrypoint=sp.TString,
        owner=sp.TAddress,
        metadata=sp.TString,
    ).layout(("contract", ("entrypoint", ("owner", "metadata"))))


class Errors:
    ZERO_CREDITS = "ZERO_CREDITS"
    TASK_ALREADY_ADDED_FOR_CONTRACT = "TASK_ALREADY_ADDED_FOR_CONTRACT"
    NOT_AUTHORISED = "NOT_AUTHORISED"


class TaskManager(sp.Contract):
    def __init__(
        self,
        sizzle_token=Addresses.TOKEN,
        sizzler_manager=Addresses.CONTRACT,
        minter=Addresses.CONTRACT,
        governor=Addresses.GOVERNOR,
        contract_to_task=sp.big_map(
            l={},
            tkey=sp.TAddress,
            tvalue=Types.TASK,
        ),
    ):
        self.init(
            sizzle_token=sizzle_token,
            sizzler_manager=sizzler_manager,
            minter=minter,
            governor=governor,
            contract_to_task=contract_to_task,
        )

        self.init_type(
            sp.TRecord(
                sizzle_token=sp.TAddress,
                sizzler_manager=sp.TAddress,
                minter=sp.TAddress,
                governor=sp.TAddress,
                contract_to_task=sp.TBigMap(sp.TAddress, Types.TASK),
            )
        )

    @sp.entry_point
    def add_task(self, params):
        sp.set_type(params, Types.ADD_TASK_PARAMS)

        # Verify that the sender is the governor
        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        # Verify that task contract is not already added
        sp.verify(~self.data.contract_to_task.contains(params.contract), Errors.TASK_ALREADY_ADDED_FOR_CONTRACT)

        # Add task to storage
        self.data.contract_to_task[params.contract] = sp.record(
            entrypoint=params.entrypoint,
            metadata=params.metadata,
            owner=params.owner,
            tip=sp.nat(0),
            credits=sp.nat(0),
        )

    @sp.entry_point
    def remove_task(self, contract):
        sp.set_type(contract, sp.TAddress)

        # Verify that sender is the owner of the task
        sp.verify(
            (sp.sender == self.data.contract_to_task[contract].owner) | (sp.sender == self.data.governor),
            Errors.NOT_AUTHORISED,
        )

        # Return remaining credits
        TokenUtils.transfer_FA12(
            sp.record(
                token_address=self.data.sizzle_token,
                from_=sp.self_address,
                to_=sp.sender,
                value=self.data.contract_to_task[contract].credits,
            )
        )

        # Remove the task from storage
        del self.data.contract_to_task[contract]

    @sp.entry_point
    def update_tip(self, params):
        sp.set_type(
            params,
            sp.TRecord(
                contract=sp.TAddress,
                amount=sp.TNat,
            ).layout(("contract", "amount")),
        )

        # Verify that the sender is the owner of the task
        sp.verify(sp.sender == self.data.contract_to_task[params.contract].owner, Errors.NOT_AUTHORISED)

        # Update storage
        self.data.contract_to_task[params.contract].tip = params.amount

    @sp.entry_point
    def add_credits(self, params):
        sp.set_type(
            params,
            sp.TRecord(
                contract=sp.TAddress,
                amount=sp.TNat,
            ).layout(("contract", "amount")),
        )

        # Verify that non-zero credits are being added
        sp.verify(params.amount > 0, Errors.ZERO_CREDITS)

        # Update storage
        self.data.contract_to_task[params.contract].credits += params.amount

        # Retrieve credits from sender
        TokenUtils.transfer_FA12(
            sp.record(
                token_address=self.data.sizzle_token,
                from_=sp.sender,
                to_=sp.self_address,
                value=params.amount,
            )
        )

    @sp.entry_point
    def remove_credits(self, params):
        sp.set_type(
            params,
            sp.TRecord(
                contract=sp.TAddress,
                amount=sp.TNat,
            ).layout(("contract", "amount")),
        )

        # Sanity checks
        sp.verify(
            (sp.sender == self.data.contract_to_task[params.contract].owner),
            Errors.NOT_AUTHORISED,
        )
        sp.verify(params.amount > 0, Errors.ZERO_CREDITS)

        # Update storage
        task = self.data.contract_to_task[params.contract]
        task.credits = sp.as_nat(task.credits - sp.min(params.amount, task.credits))

        # Return credits
        TokenUtils.transfer_FA12(
            sp.record(
                token_address=self.data.sizzle_token,
                from_=sp.self_address,
                to_=task.owner,
                value=params.amount,
            )
        )

    @sp.entry_point
    def complete_task(self, sizzler_address):
        sp.set_type(sizzler_address, sp.TAddress)

        task = self.data.contract_to_task[sp.sender]

        # Pay tip
        with sp.if_((task.tip > 0) & (task.credits > task.tip)):
            TokenUtils.transfer_FA12(
                sp.record(
                    token_address=self.data.sizzle_token,
                    from_=sp.self_address,
                    to_=sizzler_address,
                    value=task.tip,
                )
            )

            # Reduce tip from available credits
            task.credits = sp.as_nat(task.credits - task.tip)

        # Call complete_task_sizzler in SizzlerManager
        c_sm = sp.contract(sp.TAddress, self.data.sizzler_manager, "complete_task_sizzler").open_some()
        sp.transfer(sizzler_address, sp.tez(0), c_sm)

        # Call mint_sizzler_reward in Minter
        c_m = sp.contract(sp.TAddress, self.data.minter, "mint_sizzler_reward").open_some()
        sp.transfer(sizzler_address, sp.tez(0), c_m)

    ################
    # governor-only
    ################

    @sp.entry_point
    def update_minter(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.minter = address

    @sp.entry_point
    def update_sizzler_manager(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.sizzler_manager = address

    @sp.entry_point
    def update_governor(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.governor = address


if __name__ == "__main__":

    ###########
    # add_task
    ###########

    @sp.add_test(name="add_task - allows governor to add a new task")
    def test():
        scenario = sp.test_scenario()

        tm = TaskManager()

        scenario += tm

        # When GOVERNOR calls add_task
        scenario += tm.add_task(
            entrypoint="example",
            contract=Addresses.CONTRACT,
            owner=Addresses.ALICE,
            metadata="ipfs://data",
        ).run(sender=Addresses.GOVERNOR)

        # Task is added to the storage
        scenario.verify(
            tm.data.contract_to_task[Addresses.CONTRACT]
            == sp.record(
                entrypoint="example",
                metadata="ipfs://data",
                owner=Addresses.ALICE,
                tip=sp.nat(0),
                credits=sp.nat(0),
            )
        )

    ##############
    # remove_task
    ##############

    @sp.add_test(name="remove_task - removes a task and returns the remaining credits")
    def test():
        scenario = sp.test_scenario()

        sizzle = FA12(Addresses.ADMIN)

        tm = TaskManager(
            sizzle_token=sizzle.address,
            contract_to_task=sp.big_map(
                l={
                    Addresses.CONTRACT: sp.record(
                        entrypoint="example",
                        metadata="ipfs://data",
                        owner=Addresses.ALICE,
                        tip=sp.nat(0),
                        credits=sp.nat(100),
                    )
                }
            ),
        )

        scenario += tm
        scenario += sizzle

        # Mint SZL for TaskManager
        scenario += sizzle.mint(address=tm.address, value=100).run(sender=Addresses.ADMIN)

        # When ALICE calls remove_task
        scenario += tm.remove_task(Addresses.CONTRACT).run(sender=Addresses.ALICE)

        # Task is removed from the storage
        scenario.verify(~tm.data.contract_to_task.contains(Addresses.CONTRACT))

        # ALICE gets back remaining credits
        scenario.verify(sizzle.data.balances[Addresses.ALICE].balance == 100)

    ###############################
    # add_credits & remove_credits
    ###############################

    @sp.add_test(name="add_credits and remove_credits - correctly modify credits attatched to a task")
    def test():
        scenario = sp.test_scenario()

        sizzle = FA12(Addresses.ADMIN)

        tm = TaskManager(
            sizzle_token=sizzle.address,
            contract_to_task=sp.big_map(
                l={
                    Addresses.CONTRACT: sp.record(
                        entrypoint="example",
                        metadata="ipfs://data",
                        owner=Addresses.ALICE,
                        tip=sp.nat(0),
                        credits=sp.nat(0),
                    )
                }
            ),
        )

        scenario += tm
        scenario += sizzle

        # Mint SZL for ALICE
        scenario += sizzle.mint(address=Addresses.ALICE, value=100).run(sender=Addresses.ADMIN)

        # Approve TaskManager to spend SZL for ALICE
        scenario += sizzle.approve(spender=tm.address, value=100).run(sender=Addresses.ALICE)

        # When ALICE calls add_credits
        scenario += tm.add_credits(contract=Addresses.CONTRACT, amount=50).run(sender=Addresses.ALICE)

        # Credits are added to the task
        scenario.verify(tm.data.contract_to_task[Addresses.CONTRACT].credits == 50)
        scenario.verify(sizzle.data.balances[tm.address].balance == 50)

        # When ALICE calls remove_credits
        scenario += tm.remove_credits(contract=Addresses.CONTRACT, amount=25).run(sender=Addresses.ALICE)

        # Credits are removed from the task
        scenario.verify(tm.data.contract_to_task[Addresses.CONTRACT].credits == 25)
        scenario.verify(sizzle.data.balances[Addresses.ALICE].balance == 75)

    ################
    # complete_task
    ################

    @sp.add_test(name="complete_task - tips the sizzler correctly")
    def test():
        scenario = sp.test_scenario()

        sizzle = FA12(Addresses.ADMIN)
        tm = TaskManager(
            sizzle_token=sizzle.address,
            contract_to_task=sp.big_map(
                l={
                    Addresses.CONTRACT: sp.record(
                        entrypoint="example",
                        metadata="ipfs://data",
                        owner=Addresses.ALICE,
                        tip=sp.nat(10),
                        credits=sp.nat(100),
                    )
                }
            ),
        )

        scenario += sizzle
        scenario += tm

        # Mint SZL for TaskManager
        scenario += sizzle.mint(address=tm.address, value=100).run(sender=Addresses.ADMIN)

        # When complete_task is called with BOB as sizzler
        scenario += tm.complete_task(Addresses.BOB).run(sender=Addresses.CONTRACT)

        # BOB gets the tip in SZL tokens
        scenario.verify(sizzle.data.balances[Addresses.BOB].balance == 10)

    sp.add_compilation_target("task_manager", TaskManager())
