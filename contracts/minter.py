import smartpy as sp

Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")
FA12 = sp.io.import_script_from_url("file:helpers/tokens/fa12.py").FA12


class Types:
    MINT_RATES = sp.TRecord(
        sizzler=sp.TPair(sp.TNat, sp.TNat),
        dev=sp.TPair(sp.TNat, sp.TNat),
    ).layout(("sizzler", "dev"))

    LAST_MINTED = sp.TRecord(
        sizzler=sp.TTimestamp,
        dev=sp.TTimestamp,
    ).layout(("sizzler", "dev"))


class Errors:
    NOT_AUTHORISED = "NOT_AUTHORISED"


class Minter(sp.Contract):
    def __init__(
        self,
        governor=Addresses.CONTRACT,
        task_manager=Addresses.CONTRACT,
        sizzle_token=Addresses.TOKEN,
        dev_address=Addresses.ALICE,
        # SZL / num. of seconds
        mint_rates=sp.record(
            sizzler=(sp.nat(100), sp.nat(300)),
            dev=(sp.nat(100), sp.nat(1440)),
        ),
        last_minted=sp.record(
            sizzler=sp.timestamp(0),
            dev=sp.timestamp(0),
        ),
    ):
        self.init(
            governor=governor,
            task_manager=task_manager,
            sizzle_token=sizzle_token,
            dev_address=dev_address,
            mint_rates=mint_rates,
            last_minted=last_minted,
        )

        self.init_type(
            sp.TRecord(
                governor=sp.TAddress,
                task_manager=sp.TAddress,
                sizzle_token=sp.TAddress,
                dev_address=sp.TAddress,
                mint_rates=Types.MINT_RATES,
                last_minted=Types.LAST_MINTED,
            )
        )

    @sp.entry_point
    def mint_sizzler_reward(self, sizzler_address):
        sp.set_type(sizzler_address, sp.TAddress)

        # Verify that sender is TaskManager
        sp.verify(sp.sender == self.data.task_manager, Errors.NOT_AUTHORISED)

        # Calculate num. of tokens to mint
        num_tokens = sp.fst(self.data.mint_rates.sizzler) * (
            sp.as_nat(sp.now - self.data.last_minted.sizzler) // sp.snd(self.data.mint_rates.sizzler)
        )

        with sp.if_(num_tokens != 0):
            c = sp.contract(
                sp.TRecord(address=sp.TAddress, value=sp.TNat),
                self.data.sizzle_token,
                "mint",
            ).open_some()

            # Sizzler must initiate the task completion.
            sp.transfer(sp.record(address=sizzler_address, value=num_tokens), sp.tez(0), c)

            # Update last minted time
            self.data.last_minted.sizzler = sp.now

    @sp.entry_point
    def claim_dev_share(self):

        # Verify that sender is dev address
        sp.verify(sp.sender == self.data.dev_address, Errors.NOT_AUTHORISED)

        # Calculate num. of tokens to mint
        num_tokens = sp.fst(self.data.mint_rates.dev) * (
            sp.as_nat(sp.now - self.data.last_minted.dev) // sp.snd(self.data.mint_rates.dev)
        )

        with sp.if_(num_tokens != 0):
            c = sp.contract(
                sp.TRecord(address=sp.TAddress, value=sp.TNat),
                self.data.sizzle_token,
                "mint",
            ).open_some()

            sp.transfer(sp.record(address=self.data.dev_address, value=num_tokens), sp.tez(0), c)

            self.data.last_minted.dev = sp.now

    @sp.entry_point
    def mint_to_address(self, params):
        sp.set_type(params, sp.TRecord(address=sp.TAddress, value=sp.TNat))

        # Verify that sender is the governor
        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        c = sp.contract(
            sp.TRecord(address=sp.TAddress, value=sp.TNat),
            self.data.sizzle_token,
            "mint",
        ).open_some()

        sp.transfer(params, sp.tez(0), c)

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
    def update_dev_address(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.dev_address = address

    @sp.entry_point
    def update_mint_rates(self, params):
        sp.set_type(params, Types.MINT_RATES)

        sp.verify(sp.sender == self.data.governor, Errors.NOT_AUTHORISED)

        self.data.mint_rates = params


if __name__ == "__main__":

    ######################
    # mint_sizzler_reward
    ######################

    @sp.add_test(name="mint_sizzler_reward - mints correct amount of tokens")
    def test():
        scenario = sp.test_scenario()

        sizzle = FA12(Addresses.ADMIN)
        minter = Minter(
            sizzle_token=sizzle.address,
            mint_rates=sp.record(
                sizzler=(sp.nat(100), sp.nat(300)),
                dev=(sp.nat(100), sp.nat(1440)),
            ),
        )

        scenario += sizzle
        scenario += minter

        # Update admin for sizzle token
        scenario += sizzle.setAdministrator(minter.address).run(sender=Addresses.ADMIN)

        # When ALICE (a sizzler) completes a task and mint_sizzler_reward is called
        scenario += minter.mint_sizzler_reward(Addresses.ALICE).run(
            sender=Addresses.CONTRACT,
            now=sp.timestamp(650),
        )

        # Correct number of tokens are minted for ALICE
        scenario.verify(sizzle.data.balances[Addresses.ALICE].balance == 200)

    ##################
    # claim_dev_share
    ##################

    @sp.add_test(name="claim_dev_share - mints correct amount of tokens for dev")
    def test():
        scenario = sp.test_scenario()

        sizzle = FA12(Addresses.ADMIN)
        minter = Minter(
            sizzle_token=sizzle.address,
            mint_rates=sp.record(
                sizzler=(sp.nat(100), sp.nat(300)),
                dev=(sp.nat(100), sp.nat(1440)),
            ),
        )

        scenario += sizzle
        scenario += minter

        # Update admin for sizzle token
        scenario += sizzle.setAdministrator(minter.address).run(sender=Addresses.ADMIN)

        # When ALICE (the dev) calls the claim_dev_share
        scenario += minter.claim_dev_share().run(
            sender=Addresses.ALICE,
            now=sp.timestamp(2880),
        )

        # Correct number of tokens are minted for ALICE
        scenario.verify(sizzle.data.balances[Addresses.ALICE].balance == 200)

    sp.add_compilation_target("minter", Minter())
