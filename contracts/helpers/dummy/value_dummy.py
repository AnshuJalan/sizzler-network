import smartpy as sp


class ValueDummy(sp.Contract):
    def __init__(self):
        self.init(val=0)

    @sp.entry_point
    def modify_val(self, new_val):
        sp.set_type(new_val, sp.TNat)
        self.data.val = new_val
