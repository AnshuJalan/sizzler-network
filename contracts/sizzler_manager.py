import smartpy as sp


TokenUtils = sp.io.import_script_from_url("file:utils/token.py")
Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")
FA2 = sp.io.import_script_from_url("file:helpers/tokens/fa2.py")


class Types:
    SIZZLER = tvalue = sp.TRecord(
        stake=sp.TNat,
        task_counter=sp.TNat,
        task_limit=sp.TNat,
        last_reset_at=sp.TTimestamp,
    ).layout(("stake", ("task_counter", ("task_limit", "last_reset_at"))))

    STAKING_PARAMETERS = sp.TRecord(
        deposit_delay=sp.TInt,
        withdrawal_delay=sp.TInt,
    ).layout(("deposit_delay", "withdrawal_delay"))

    TASK_PARAMETERS = sp.TRecord(
        lp_tokens_per_task=sp.TNat,
        task_limit_reset_period=sp.TNat,
    ).layout(("lp_tokens_per_task", "task_limit_reset_period"))

    DEPOSIT_WITHDRAWAL = sp.TRecord(
        amount=sp.TNat,
        confirmation_at=sp.TTimestamp,
    ).layout(("amount", "confirmation_at"))


class Errors:
    ZERO_DEPOSIT = "ZERO_DEPOSIT"
    NO_DEPOSIT_TO_CONFIRM = "NO_DEPOSIT_TO_CONFIRM"
    BEHIND_CONFIRMATION_TIME = "BEHIND_CONFIRMATION_TIME"
    ZERO_WITHDRAWAL = "ZERO_WITHDRAWAL"
    WITHDRAWAL_AMOUNT_TOO_HIGH = "WITHDRAWAL_AMOUNT_TOO_HIGH"
    NO_WITHDRAWAL_TO_CONFIRM = "NO_WITHDRAWAL_TO_CONFIRM"
    WITHDRAWAL_PENDING = "WITHDRAWAL_PENDING"
    TASK_LIMIT_REACHED = "TASK_LIMIT_REACHED"
    NOT_AUTHORISED = "NOT_AUTHORISED"
    INVALID_SIZZLER = "INVALID_SIZZLER"


class SizzlerManager(sp.Contract):
    def __init__(
        self,
        sizzle_lp_token=(Addresses.LP_TOKEN, sp.nat(0)),  # (contract address, token-id)
        governor=Addresses.CONTRACT,
        task_manager=Addresses.CONTRACT,
        staking_parameters=sp.record(
            deposit_delay=sp.int(0),
            withdrawal_delay=sp.int(0),
        ),
        task_parameters=sp.record(
            lp_tokens_per_task=sp.nat(0),
            task_limit_reset_period=sp.nat(0),
        ),
        sizzlers=sp.big_map(
            l={},
            tkey=sp.TAddress,
            tvalue=Types.SIZZLER,
        ),
        deposits=sp.big_map(
            l={},
            tkey=sp.TAddress,
            tvalue=Types.DEPOSIT_WITHDRAWAL,
        ),
        withdrawals=sp.big_map(
            l={},
            tkey=sp.TAddress,
            tvalue=Types.DEPOSIT_WITHDRAWAL,
        ),
    ):
        self.init(
            sizzle_lp_token=sizzle_lp_token,
            governor=governor,
            task_manager=task_manager,
            staking_parameters=staking_parameters,
            task_parameters=task_parameters,
            sizzlers=sizzlers,
            deposits=deposits,
            withdrawals=withdrawals,
        )

        self.init_type(
            sp.TRecord(
                sizzle_lp_token=sp.TPair(sp.TAddress, sp.TNat),
                governor=sp.TAddress,
                task_manager=sp.TAddress,
                staking_parameters=Types.STAKING_PARAMETERS,
                task_parameters=Types.TASK_PARAMETERS,
                sizzlers=sp.TBigMap(sp.TAddress, Types.SIZZLER),
                deposits=sp.TBigMap(sp.TAddress, Types.DEPOSIT_WITHDRAWAL),
                withdrawals=sp.TBigMap(sp.TAddress, Types.DEPOSIT_WITHDRAWAL),
            )
        )

    @sp.entry_point
    def deposit(self, amount):
        sp.set_type(amount, sp.TNat)

        # Verify that a positive amount is being deposited
        sp.verify(amount > 0, Errors.ZERO_DEPOSIT)

        # Insert sender into deposits big_map if required
        with sp.if_(~self.data.deposits.contains(sp.sender)):
            self.data.deposits[sp.sender] = sp.record(
                amount=sp.nat(0),
                confirmation_at=sp.timestamp(0),
            )

        # Update deposit amount
        self.data.deposits[sp.sender].amount += amount

        # Set the confirmation time based on deposit_delay
        self.data.deposits[sp.sender].confirmation_at = sp.now.add_seconds(self.data.staking_parameters.deposit_delay)

        # Retrieve LP tokens from sender
        TokenUtils.transfer_FA2(
            sp.record(
                token_address=sp.fst(self.data.sizzle_lp_token),
                token_id=sp.snd(self.data.sizzle_lp_token),
                from_=sp.sender,
                to_=sp.self_address,
                amount=amount,
            )
        )

    @sp.entry_point
    def confirm_deposit(self):

        # Sanity checks
        sp.verify(self.data.deposits[sp.sender].amount > 0, Errors.NO_DEPOSIT_TO_CONFIRM)
        sp.verify(sp.now >= self.data.deposits[sp.sender].confirmation_at, Errors.BEHIND_CONFIRMATION_TIME)

        # Insert sender into sizzlers big_map if required
        with sp.if_(~self.data.sizzlers.contains(sp.sender)):
            self.data.sizzlers[sp.sender] = sp.record(
                stake=sp.nat(0),
                task_counter=sp.nat(0),
                task_limit=sp.nat(0),
                last_reset_at=sp.timestamp(0),
            )

        # Update stake based on deposit
        self.data.sizzlers[sp.sender].stake += self.data.deposits[sp.sender].amount

        # Reset deposit amount
        self.data.deposits[sp.sender].amount = 0

    @sp.entry_point
    def withdraw(self, amount):
        sp.set_type(amount, sp.TNat)

        pending_withdrawal = self.data.withdrawals.get(
            sp.sender, sp.record(amount=sp.nat(0), confirmation_at=sp.timestamp(0))
        )

        # Sanity checks
        sp.verify(amount > 0, Errors.ZERO_WITHDRAWAL)
        sp.verify(
            self.data.sizzlers[sp.sender].stake >= (amount + pending_withdrawal.amount),
            Errors.WITHDRAWAL_AMOUNT_TOO_HIGH,
        )

        # Insert sender into withdrawals big_map if required
        with sp.if_(~self.data.withdrawals.contains(sp.sender)):
            self.data.withdrawals[sp.sender] = sp.record(
                amount=sp.nat(0),
                confirmation_at=sp.timestamp(0),
            )

        # Update withdrawal amount
        self.data.withdrawals[sp.sender].amount += amount

        # Set the confirmation time based on deposit_delay
        self.data.withdrawals[sp.sender].confirmation_at = sp.now.add_seconds(
            self.data.staking_parameters.withdrawal_delay
        )

    @sp.entry_point
    def confirm_withdrawal(self):

        # Sanity checks
        sp.verify(self.data.withdrawals[sp.sender].amount > 0, Errors.NO_WITHDRAWAL_TO_CONFIRM)
        sp.verify(sp.now >= self.data.withdrawals[sp.sender].confirmation_at, Errors.BEHIND_CONFIRMATION_TIME)

        sizzler = self.data.sizzlers[sp.sender]

        # Update stake based on withdrawal amount
        sizzler.stake = sp.as_nat(sizzler.stake - self.data.withdrawals[sp.sender].amount)

        # Return withdrawn amount
        TokenUtils.transfer_FA2(
            sp.record(
                token_address=sp.fst(self.data.sizzle_lp_token),
                token_id=sp.snd(self.data.sizzle_lp_token),
                from_=sp.self_address,
                to_=sp.sender,
                amount=self.data.withdrawals[sp.sender].amount,
            )
        )

        # Reset relevant sizzler fields
        sizzler.task_limit = sizzler.stake // self.data.task_parameters.lp_tokens_per_task
        sizzler.task_counter = 0
        sizzler.last_reset_at = sp.now

        # Reset withdrawal amount
        self.data.withdrawals[sp.sender].amount = 0

    @sp.entry_point
    def complete_task_sizzler(self):

        # Verify that the sender is the TaskManager contract
        sp.verify(sp.sender == self.data.task_manager, Errors.NOT_AUTHORISED)

        # The sizzler must initiate the txn at the task contract
        sizzler_address = sp.source
        sizzler = self.data.sizzlers[sizzler_address]

        # Verify that the sizzler does not have a pending withdrawal
        pending_withdrawal = self.data.withdrawals.get(
            sp.sender, sp.record(amount=sp.nat(0), confirmation_at=sp.timestamp(0))
        )
        sp.verify(pending_withdrawal.amount == 0, Errors.WITHDRAWAL_PENDING)

        # Reset task limit and counter if the timing is correct
        with sp.if_(sp.as_nat(sp.now - sizzler.last_reset_at) > self.data.task_parameters.task_limit_reset_period):
            sizzler.task_limit = sizzler.stake // self.data.task_parameters.lp_tokens_per_task
            sizzler.task_counter = 0
            sizzler.last_reset_at = sp.now

        # Verify that enough tasks are left for sizzler
        sp.verify(sizzler.task_counter < sizzler.task_limit, Errors.TASK_LIMIT_REACHED)

        # Increase task counter
        sizzler.task_counter += 1

    ################
    # governor only
    ################

    @sp.entry_point
    def update_task_manager(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.task_manager = address

    @sp.entry_point
    def update_governor(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.governor = address

    @sp.entry_point
    def update_staking_parameters(self, params):
        sp.set_type(params, Types.STAKING_PARAMETERS)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.staking_parameters = params

    @sp.entry_point
    def update_task_parameters(self, params):
        sp.set_type(params, Types.TASK_PARAMETERS)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.task_parameters = params

    ########
    # Views
    ########

    @sp.onchain_view()
    def get_sizzler_voting_power(self, address):
        sp.set_type(address, sp.TAddress)

        # Verify that sizzler exists
        sp.verify(self.data.sizzlers.contains(address), Errors.INVALID_SIZZLER)

        pending_withdrawal = self.data.withdrawals.get(
            address, sp.record(amount=sp.nat(0), confirmation_at=sp.timestamp(0))
        )

        # Voting power is zero with pending withdrawals
        with sp.if_(pending_withdrawal.amount != 0):
            sp.result(sp.nat(0))
        # Otherwise, voting power equals the maximum possible task limit for the sizzler
        with sp.else_():
            sp.result(self.data.sizzlers[address].stake // self.data.task_parameters.lp_tokens_per_task)

    @sp.onchain_view()
    def get_sizzler(self, address):
        sp.set_type(address, sp.TAddress)

        # Verify that sizzler exists
        sp.verify(self.data.sizzlers.contains(address), Errors.INVALID_SIZZLER)

        sp.result(self.data.sizzlers[address])

    @sp.onchain_view()
    def get_staking_parameters(self):
        sp.result(self.data.staking_parameters)

    @sp.onchain_view()
    def get_task_parameters(self):
        sp.result(self.data.task_parameters)


if __name__ == "__main__":

    ##########
    # deposit
    ##########

    @sp.add_test(name="deposit - accepts sizzle lp tokens and opens up a pending deposit position")
    def test():
        scenario = sp.test_scenario()

        lp_token = FA2.FA2(
            FA2.FA2_config(),
            sp.utils.metadata_of_url("https://example.com"),
            Addresses.ADMIN,
        )
        sm = SizzlerManager(
            sizzle_lp_token=(lp_token.address, 0),
            staking_parameters=sp.record(
                deposit_delay=sp.int(7),
                withdrawal_delay=sp.int(14),
            ),
        )

        scenario += lp_token
        scenario += sm

        # Mint sizzle lp tokens for ALICE
        scenario += lp_token.mint(
            address=Addresses.ALICE,
            amount=200,
            metadata=FA2.FA2.make_metadata(name="TOKEN", decimals=18, symbol="LP"),
            token_id=0,
        ).run(sender=Addresses.ADMIN)

        # Make SizzlerManager the operator for ALICE's tokens
        scenario += lp_token.update_operators(
            [sp.variant("add_operator", sp.record(owner=Addresses.ALICE, operator=sm.address, token_id=0))]
        ).run(sender=Addresses.ALICE)

        # When ALICE calls deposit entrypoint
        scenario += sm.deposit(100).run(sender=Addresses.ALICE, now=sp.timestamp(5))

        # A pending deposit position is opened correctly
        scenario.verify(sm.data.deposits[Addresses.ALICE] == sp.record(amount=100, confirmation_at=sp.timestamp(12)))

        # LP tokens are retrieved by SizzlerManager
        scenario.verify(lp_token.data.ledger[sm.address].balance == 100)

    @sp.add_test(name="deposit - adds to existing deposit position for subsequent deposits")
    def test():
        scenario = sp.test_scenario()

        lp_token = FA2.FA2(
            FA2.FA2_config(),
            sp.utils.metadata_of_url("https://example.com"),
            Addresses.ADMIN,
        )

        # Initialize an existing pending deposit position
        sm = SizzlerManager(
            sizzle_lp_token=(lp_token.address, 0),
            staking_parameters=sp.record(
                deposit_delay=sp.int(7),
                withdrawal_delay=sp.int(14),
            ),
            deposits=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(amount=100, confirmation_at=sp.timestamp(12)),
                }
            ),
        )

        scenario += lp_token
        scenario += sm

        # Mint sizzle lp tokens for ALICE
        scenario += lp_token.mint(
            address=Addresses.ALICE,
            amount=100,
            metadata=FA2.FA2.make_metadata(name="TOKEN", decimals=18, symbol="LP"),
            token_id=0,
        ).run(sender=Addresses.ADMIN)

        # Make SizzlerManager the operator for ALICE's tokens
        scenario += lp_token.update_operators(
            [sp.variant("add_operator", sp.record(owner=Addresses.ALICE, operator=sm.address, token_id=0))]
        ).run(sender=Addresses.ALICE)

        # When ALICE calls deposit
        scenario += sm.deposit(100).run(sender=Addresses.ALICE, now=sp.timestamp(10))

        # Pending deposit position is updated correctly
        scenario.verify(sm.data.deposits[Addresses.ALICE] == sp.record(amount=200, confirmation_at=sp.timestamp(17)))

        # LP tokens are retrieved by SizzlerManager
        scenario.verify(lp_token.data.ledger[sm.address].balance == 100)

    ##################
    # confirm_deposit
    ##################

    @sp.add_test(name="confirm_deposit - adds a new sizzler and updates the stake")
    def test():
        scenario = sp.test_scenario()

        # Initialize an existing pending deposit position
        sm = SizzlerManager(
            deposits=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(amount=100, confirmation_at=sp.timestamp(12)),
                }
            ),
        )

        scenario += sm

        # When ALICE calls confirm_deposit
        scenario += sm.confirm_deposit().run(sender=Addresses.ALICE, now=sp.timestamp(13))

        # She is registered as a sizzler with correct stake
        scenario.verify(sm.data.sizzlers[Addresses.ALICE].stake == 100)

    ###########
    # withdraw
    ###########

    @sp.add_test(name="withdraw - opens up a pending withdrawal position")
    def test():
        scenario = sp.test_scenario()

        sm = SizzlerManager(
            staking_parameters=sp.record(
                deposit_delay=sp.int(7),
                withdrawal_delay=sp.int(14),
            ),
            sizzlers=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(
                        stake=100,
                        task_counter=0,
                        task_limit=0,
                        last_reset_at=sp.timestamp(0),
                    )
                }
            ),
        )

        scenario += sm

        # When ALICE calls withdraw
        scenario += sm.withdraw(50).run(sender=Addresses.ALICE, now=sp.timestamp(10))

        # A new withdrawal position is opened correctly
        scenario.verify(sm.data.withdrawals[Addresses.ALICE] == sp.record(amount=50, confirmation_at=sp.timestamp(24)))

    @sp.add_test(name="withdraw - adds to existing withdrawal position for subsequent withdrawals")
    def test():
        scenario = sp.test_scenario()

        sm = SizzlerManager(
            staking_parameters=sp.record(
                deposit_delay=sp.int(7),
                withdrawal_delay=sp.int(14),
            ),
            sizzlers=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(
                        stake=100,
                        task_counter=0,
                        task_limit=0,
                        last_reset_at=sp.timestamp(0),
                    )
                }
            ),
            withdrawals=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(amount=50, confirmation_at=sp.timestamp(24)),
                }
            ),
        )

        scenario += sm

        # When ALICE calls withdraw
        scenario += sm.withdraw(30).run(sender=Addresses.ALICE, now=sp.timestamp(30))

        # Existing withdrawal position is updated
        scenario.verify(sm.data.withdrawals[Addresses.ALICE] == sp.record(amount=80, confirmation_at=sp.timestamp(44)))

    #####################
    # confirm_withdrawal
    #####################

    @sp.add_test(name="confirm_withdrawal - updates the sizzler fields and returns lp tokens to sizzler")
    def test():
        scenario = sp.test_scenario()

        lp_token = FA2.FA2(
            FA2.FA2_config(),
            sp.utils.metadata_of_url("https://example.com"),
            Addresses.ADMIN,
        )

        # Initialize an existing pending deposit position
        sm = SizzlerManager(
            sizzle_lp_token=(lp_token.address, 0),
            task_parameters=sp.record(
                lp_tokens_per_task=10,
                task_limit_reset_period=5,
            ),
            withdrawals=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(amount=80, confirmation_at=sp.timestamp(44)),
                }
            ),
            sizzlers=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(
                        stake=100,
                        task_counter=0,
                        task_limit=0,
                        last_reset_at=sp.timestamp(0),
                    )
                }
            ),
        )

        scenario += lp_token
        scenario += sm

        # Mint sizzle lp tokens for SizzlerManager
        scenario += lp_token.mint(
            address=sm.address,
            amount=100,
            metadata=FA2.FA2.make_metadata(name="TOKEN", decimals=18, symbol="LP"),
            token_id=0,
        ).run(sender=Addresses.ADMIN)

        # When calls confirm_withdrawal
        scenario += sm.confirm_withdrawal().run(sender=Addresses.ALICE, now=sp.timestamp(45))

        # Her sizzler fields are updated correctly
        scenario.verify(
            sm.data.sizzlers[Addresses.ALICE]
            == sp.record(
                stake=20,
                task_counter=0,
                task_limit=2,
                last_reset_at=sp.timestamp(45),
            )
        )

        # She gets back her LP tokens
        scenario.verify(lp_token.data.ledger[Addresses.ALICE].balance == 80)

    ########################
    # complete_task_sizzler
    ########################

    @sp.add_test(name="complete_task_sizzler - updates the task counter")
    def test():
        scenario = sp.test_scenario()

        sm = SizzlerManager(
            task_parameters=sp.record(
                lp_tokens_per_task=10,
                task_limit_reset_period=5,
            ),
            sizzlers=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(
                        stake=100,
                        task_counter=2,
                        task_limit=10,
                        last_reset_at=sp.timestamp(1),
                    )
                }
            ),
        )

        scenario += sm

        # When complete_task_sizzler is called with source as ALICE
        scenario += sm.complete_task_sizzler().run(
            sender=Addresses.CONTRACT,
            source=Addresses.ALICE,
            now=sp.timestamp(3),
        )

        # Her task counter is incremented
        scenario.verify(sm.data.sizzlers[Addresses.ALICE].task_counter == 3)

    @sp.add_test(name="complete_task_sizzler - resets the task counter after reset period")
    def test():
        scenario = sp.test_scenario()

        sm = SizzlerManager(
            task_parameters=sp.record(
                lp_tokens_per_task=10,
                task_limit_reset_period=5,
            ),
            sizzlers=sp.big_map(
                l={
                    Addresses.ALICE: sp.record(
                        stake=50,
                        task_counter=2,
                        task_limit=10,
                        last_reset_at=sp.timestamp(1),
                    )
                }
            ),
        )

        scenario += sm

        # When complete_task_sizzler is called with source as ALICE, after a reset period (1 + 5 + 1 (extra))
        scenario += sm.complete_task_sizzler().run(
            sender=Addresses.CONTRACT,
            source=Addresses.ALICE,
            now=sp.timestamp(7),
        )

        # Her task limit is updated
        scenario.verify(sm.data.sizzlers[Addresses.ALICE].task_limit == 5)

        # Her task counter is incremented
        scenario.verify(sm.data.sizzlers[Addresses.ALICE].task_counter == 1)

    sp.add_compilation_target("sizzler_manager", SizzlerManager())
