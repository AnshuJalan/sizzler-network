import smartpy as sp


class MinterDummy(sp.Contract):
    def __init__(self):
        self.init()

    @sp.entry_point
    def mint_sizzler_reward(self):
        pass
