import smartpy as sp


class SizzlerManagerDummy(sp.Contract):
    def __init__(self):
        self.init()

    @sp.entry_point
    def complete_task_sizzler(self):
        pass
