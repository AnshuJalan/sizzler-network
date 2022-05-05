import smartpy as sp

Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")
SizzlerManagerDummy = sp.io.import_script_from_url("file:helpers/dummy/sizzler_manager_dummy.py").SizzlerManagerDummy
ValueDummy = sp.io.import_script_from_url("file:helpers/dummy/value_dummy.py").ValueDummy

############
# Constants
############

HOUR = 3600
DAY = 24 * HOUR

########
# Types
########


class Types:
    PROPOSAL = sp.TRecord(
        title=sp.TString,
        handler=sp.TAddress,
        description_link=sp.TString,
        proposal_lambda=sp.TLambda(sp.TUnit, sp.TList(sp.TOperation)),
        up_votes=sp.TNat,
        down_votes=sp.TNat,
        voters=sp.TMap(sp.TAddress, sp.TVariant(up_vote=sp.TNat, down_vote=sp.TNat)),
        status=sp.TVariant(voting=sp.TTimestamp, timelocked=sp.TTimestamp, passed=sp.TUnit, failed=sp.TUnit),
    ).layout(
        (
            "title",
            (
                "handler",
                (
                    "description_link",
                    (
                        "proposal_lambda",
                        (
                            "up_votes",
                            ("down_votes", ("voters", "status")),
                        ),
                    ),
                ),
            ),
        )
    )

    GOVERNANCE_PARAMETERS = sp.TRecord(
        voting_period=sp.TInt,
        quorum_threshold=sp.TNat,
        proposal_threshold=sp.TNat,
        timelock_period=sp.TInt,
    ).layout(
        (
            "voting_period",
            (
                "quorum_threshold",
                ("proposal_threshold", "timelock_period"),
            ),
        )
    )

    PROPOSE_PARAMS = sp.TRecord(
        title=sp.TString,
        description_link=sp.TString,
        proposal_lambda=sp.TLambda(sp.TUnit, sp.TList(sp.TOperation)),
    ).layout(
        (
            "title",
            ("description_link", "proposal_lambda"),
        ),
    )

    VOTE_PARAMS = sp.TRecord(
        proposal_id=sp.TNat,
        vote=sp.TVariant(up_vote=sp.TUnit, down_vote=sp.TUnit),
    ).layout(("proposal_id", "vote"))


#########
# Errors
########


class Errors:
    NOT_ENOUGH_VOTING_POWER = "NOT_ENOUGH_VOTING_POWER"
    VOTING_OVER = "VOTING_OVER"
    ALREADY_VOTED = "ALREADY_VOTED"
    PROPOSAL_TIMELOCKED = "PROPOSAL_TIMELOCKED"
    CANNOT_FLUSH_PROPOSAL = "CANNOT_FLUSH_PROPOSAL"

    # Generic
    NOT_AUTHORISED = "NOT_AUTHORISED"
    INVALID_VIEW = "INVALID_VIEW"


###########
# Contract
###########


class Governor(sp.Contract):
    def __init__(
        self,
        uid=sp.nat(0),
        sizzler_manager=Addresses.CONTRACT,
        governance_parameters=sp.record(
            voting_period=sp.int(0),
            quorum_threshold=sp.nat(0),
            proposal_threshold=sp.nat(0),
            timelock_period=sp.int(0),
        ),
        proposals=sp.big_map(
            l={},
            tkey=sp.TNat,
            tvalue=Types.PROPOSAL,
        ),
    ):
        self.init(
            uid=uid,
            sizzler_manager=sizzler_manager,
            governance_parameters=governance_parameters,
            proposals=proposals,
        )

        self.init_type(
            sp.TRecord(
                uid=sp.TNat,
                sizzler_manager=sp.TAddress,
                governance_parameters=Types.GOVERNANCE_PARAMETERS,
                proposals=sp.TBigMap(sp.TNat, Types.PROPOSAL),
            )
        )

    @sp.entry_point
    def propose(self, params):
        sp.set_type(params, Types.PROPOSE_PARAMS)

        # Fetch sender's (a sizzler) voting power
        voting_power = sp.view(
            "get_sizzler_voting_power",
            self.data.sizzler_manager,
            sp.sender,
            sp.TNat,
        ).open_some(Errors.INVALID_VIEW)

        # Verify that the sizzler has sufficient voting power
        sp.verify(voting_power >= self.data.governance_parameters.proposal_threshold, Errors.NOT_ENOUGH_VOTING_POWER)

        # Prepare the proposal
        proposal = sp.record(
            title=params.title,
            handler=sp.sender,
            description_link=params.description_link,
            proposal_lambda=params.proposal_lambda,
            up_votes=sp.nat(0),
            down_votes=sp.nat(0),
            voters={},
            status=sp.variant("voting", sp.now.add_seconds(self.data.governance_parameters.voting_period)),
        )

        # Insert proposal to storage
        self.data.uid += 1
        self.data.proposals[self.data.uid] = proposal

    @sp.entry_point
    def vote(self, params):
        sp.set_type(params, Types.VOTE_PARAMS)

        proposal = self.data.proposals[params.proposal_id]

        # Sanity checks
        sp.verify(
            proposal.status.is_variant("voting") & (sp.now < proposal.status.open_variant("voting")),
            Errors.VOTING_OVER,
        )
        sp.verify(~proposal.voters.contains(sp.sender), Errors.ALREADY_VOTED)

        # Fetch sender's (a sizzler) voting power
        voting_power = sp.view(
            "get_sizzler_voting_power",
            self.data.sizzler_manager,
            sp.sender,
            sp.TNat,
        ).open_some(Errors.INVALID_VIEW)

        # Verify that the sizzler has sufficient voting power
        sp.verify(voting_power > 0, Errors.NOT_ENOUGH_VOTING_POWER)

        # Include vote
        with params.vote.match_cases() as arg:
            with arg.match("up_vote") as _:
                proposal.up_votes += voting_power
                proposal.voters[sp.sender] = sp.variant("up_vote", voting_power)
            with arg.match("down_vote") as _:
                proposal.down_votes += voting_power
                proposal.voters[sp.sender] = sp.variant("down_vote", voting_power)

    @sp.entry_point
    def end_voting(self, proposal_id):
        sp.set_type(proposal_id, sp.TNat)

        proposal = self.data.proposals[proposal_id]

        # Verify that the timing is correct
        sp.verify(
            proposal.status.is_variant("voting") & (sp.now > proposal.status.open_variant("voting")),
            Errors.VOTING_OVER,
        )

        total_votes = proposal.up_votes + proposal.down_votes

        # If proposal meets passing criterion, timelock it
        with sp.if_(
            (proposal.up_votes > proposal.down_votes)
            & (total_votes >= self.data.governance_parameters.quorum_threshold)
        ):
            proposal.status = sp.variant(
                "timelocked", sp.now.add_seconds(self.data.governance_parameters.timelock_period)
            )
        # Else, mark as failed
        with sp.else_():
            proposal.status = sp.variant("failed", sp.unit)

    @sp.entry_point
    def flush_proposal(self, proposal_id):
        sp.set_type(proposal_id, sp.TNat)

        proposal = self.data.proposals[proposal_id]

        # Sanity checks
        sp.verify(sp.sender == proposal.handler, Errors.NOT_AUTHORISED)
        sp.verify(proposal.status.is_variant("timelocked"), Errors.CANNOT_FLUSH_PROPOSAL)

        # Remove proposal from storage
        del self.data.proposals[proposal_id]

    @sp.entry_point
    def execute(self, proposal_id):
        sp.set_type(proposal_id, sp.TNat)

        proposal = self.data.proposals[proposal_id]

        # Verify that the timing is correct
        sp.verify(
            proposal.status.is_variant("timelocked") & (sp.now > proposal.status.open_variant("timelocked")),
            Errors.PROPOSAL_TIMELOCKED,
        )

        # Mark proposal as passed
        proposal.status = sp.variant("passed", sp.unit)

        # Execute proposal lambda
        sp.add_operations(proposal.proposal_lambda(sp.unit))

    ################
    # governor-only
    ################

    @sp.entry_point
    def update_governance_parameters(self, params):
        sp.set_type(params, Types.GOVERNANCE_PARAMETERS)

        sp.verify(sp.sender == sp.self_address, Errors.NOT_AUTHORISED)

        self.data.governance_parameters = params

    @sp.entry_point
    def update_sizzler_manager(self, address):
        sp.set_type(address, sp.TAddress)

        sp.verify(sp.sender == sp.self_address, Errors.NOT_AUTHORISED)

        self.data.sizzler_manager = address


if __name__ == "__main__":

    ##########
    # propose
    ##########

    @sp.add_test(name="propose - allows a sizzler to put a new proposal to vote")
    def test():
        scenario = sp.test_scenario()

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        # When ALICE (a dummy sizzler) calls propose entrypoint
        scenario += governor.propose(
            title="Proposal",
            description_link="ipfs://",
            proposal_lambda=proposal_lambda,
        ).run(
            sender=Addresses.ALICE,
            now=sp.timestamp(0),
        )

        # Proposal is added correctly to the storage
        proposal = governor.data.proposals[1]
        scenario.verify(proposal.handler == Addresses.ALICE)
        scenario.verify(proposal.description_link == "ipfs://")
        scenario.verify(proposal.up_votes == sp.nat(0))
        scenario.verify(proposal.down_votes == sp.nat(0))
        scenario.verify_equal(proposal.voters, {})
        scenario.verify(proposal.status == sp.variant("voting", sp.timestamp(12 * HOUR)))

    #######
    # vote
    #######

    @sp.add_test(name="vote - allows sizzlers to vote for a proposal")
    def test():
        scenario = sp.test_scenario()

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
            proposals=sp.big_map(
                l={
                    1: sp.record(
                        title="Proposal",
                        handler=Addresses.ALICE,
                        description_link="ipfs://",
                        proposal_lambda=proposal_lambda,
                        up_votes=sp.nat(0),
                        down_votes=sp.nat(0),
                        voters={},
                        status=sp.variant("voting", sp.timestamp(12 * HOUR)),
                    )
                }
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        # When BOB and MIKE vote for the proposal
        scenario += governor.vote(proposal_id=1, vote=sp.variant("up_vote", sp.unit)).run(
            sender=Addresses.BOB,
            now=sp.timestamp(1 * HOUR),
        )
        scenario += governor.vote(proposal_id=1, vote=sp.variant("down_vote", sp.unit)).run(
            sender=Addresses.MIKE,
            now=sp.timestamp(1 * HOUR),
        )

        # The votes are recorded correctly
        proposal = governor.data.proposals[1]
        scenario.verify(proposal.up_votes == 2)
        scenario.verify(proposal.down_votes == 2)
        scenario.verify(proposal.voters[Addresses.BOB].open_variant("up_vote") == 2)
        scenario.verify(proposal.voters[Addresses.MIKE].open_variant("down_vote") == 2)

    #############
    # end_voting
    #############

    @sp.add_test(name="end_voting - timelocks the proposal if passing criterion met")
    def test():
        scenario = sp.test_scenario()

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
            proposals=sp.big_map(
                l={
                    1: sp.record(
                        title="Proposal",
                        handler=Addresses.ALICE,
                        description_link="ipfs://",
                        proposal_lambda=proposal_lambda,
                        up_votes=sp.nat(9),
                        down_votes=sp.nat(8),
                        voters={},
                        status=sp.variant("voting", sp.timestamp(12 * HOUR)),
                    )
                }
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        # When end_voting is called
        scenario += governor.end_voting(1).run(now=sp.timestamp(12 * HOUR + 1))

        # Proposal is timelocks
        scenario.verify(governor.data.proposals[1].status.open_variant("timelocked") == sp.timestamp(15 * HOUR + 1))

    @sp.add_test(name="end_voting - marks the proposal as failed if passing criterion not met")
    def test():
        scenario = sp.test_scenario()

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
            proposals=sp.big_map(
                l={
                    1: sp.record(
                        title="Proposal",
                        handler=Addresses.ALICE,
                        description_link="ipfs://",
                        proposal_lambda=proposal_lambda,
                        up_votes=sp.nat(6),
                        down_votes=sp.nat(8),
                        voters={},
                        status=sp.variant("voting", sp.timestamp(12 * HOUR)),
                    )
                }
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        # When end_voting is called
        scenario += governor.end_voting(1).run(now=sp.timestamp(12 * HOUR + 1))

        # Proposal is timelocks
        scenario.verify(governor.data.proposals[1].status.is_variant("failed"))

    #################
    # flush_proposal
    #################

    @sp.add_test(name="flush_proposal - removes a timelocked proposal before execution")
    def test():
        scenario = sp.test_scenario()

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
            proposals=sp.big_map(
                l={
                    1: sp.record(
                        title="Proposal",
                        handler=Addresses.ALICE,
                        description_link="ipfs://",
                        proposal_lambda=proposal_lambda,
                        up_votes=sp.nat(9),
                        down_votes=sp.nat(8),
                        voters={},
                        status=sp.variant("timelocked", sp.timestamp(16 * HOUR)),
                    )
                }
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        # When ALICE (proposal handler) calls flush_proposal
        scenario += governor.flush_proposal(1).run(sender=Addresses.ALICE)

        # Proposal is removed from the storage
        scenario.verify(~governor.data.proposals.contains(1))

    ##########
    # execute
    ##########

    @sp.add_test(name="execute - executes the proposal lambda after timelock is over")
    def test():
        scenario = sp.test_scenario()

        def proposal_lambda(unit_param):
            sp.set_type(unit_param, sp.TUnit)
            c = sp.contract(sp.TNat, vd.address, "modify_val").open_some()
            sp.result([sp.transfer_operation(5, sp.mutez(0), c)])

        sm = SizzlerManagerDummy(voting_power=sp.nat(2))
        vd = ValueDummy()
        governor = Governor(
            sizzler_manager=sm.address,
            governance_parameters=sp.record(
                voting_period=sp.int(12 * HOUR),
                quorum_threshold=sp.nat(15),
                proposal_threshold=sp.nat(1),
                timelock_period=sp.int(3 * HOUR),
            ),
            proposals=sp.big_map(
                l={
                    1: sp.record(
                        title="Proposal",
                        handler=Addresses.ALICE,
                        description_link="ipfs://",
                        proposal_lambda=proposal_lambda,
                        up_votes=sp.nat(9),
                        down_votes=sp.nat(8),
                        voters={},
                        status=sp.variant("timelocked", sp.timestamp(16 * HOUR)),
                    )
                }
            ),
        )

        scenario += sm
        scenario += vd
        scenario += governor

        # When execute is called
        scenario += governor.execute(1).run(now=sp.timestamp(16 * HOUR + 1))

        # The lambda is succesfully executed
        scenario.verify(vd.data.val == 5)

        # Proposal is marked passed
        scenario.verify(governor.data.proposals[1].status.is_variant("passed"))

    sp.add_compilation_target("governor", Governor())
