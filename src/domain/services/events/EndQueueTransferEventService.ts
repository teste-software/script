import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {EndAnsweredEventAggregate} from "../../aggregate/events/EndAnsweredEvent";
import {AnsweredEventAggregate} from "../../aggregate/events/AnsweredEvent";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import BranchAggregate from "../../aggregate/BranchAggregate";
import {EndQueueTransferEventAggregate} from "../../aggregate/events/EndQueueTransferEvent";


@injectable()
export default class EndQueueTransferEventService extends EventService {

    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new EndQueueTransferEventAggregate(event);

        this.validateNextEvent(callSession.lastEvent!, eventAggregate);

        const callAggregate = callSession.call;
        callAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        callAggregate.forwardingToQueue(eventAggregate.event.queueId.getValue(), eventAggregate.NAME_EVENT);

        this.updateParticipantBranches(callSession, eventAggregate);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }

    private updateParticipantBranches(callSession: CallSession, eventAggregate: EndQueueTransferEventAggregate) {
        const participantsBranches = eventAggregate.getCallParticipantsBranches();

        const updateBranch = (branchNumber?: BranchNumber) => {
            if (!branchNumber) return;

            let branchAggregate = callSession.branches[branchNumber.getValue()];
            if (!branchAggregate) {
                branchAggregate = new BranchAggregate(branchNumber.getValue());
                this.callRepositoryDomain.addCallWithParticipantBranches(callSession.callId, callSession.clientId, branchAggregate);
            }

            branchAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        };

        updateBranch(participantsBranches.destinationBranchNumber);
    }
}
