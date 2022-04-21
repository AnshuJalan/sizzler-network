import smartpy as sp


class SizzlerManagerDummy(sp.Contract):
    def __init__(
        self,
        voting_power=sp.nat(1),
    ):
        self.init(
            voting_power=voting_power,
        )

    @sp.entry_point
    def complete_task_sizzler(self):
        pass

    @sp.onchain_view()
    def get_sizzler_voting_power(self, address):
        sp.set_type(address, sp.TAddress)
        sp.result(self.data.voting_power)
