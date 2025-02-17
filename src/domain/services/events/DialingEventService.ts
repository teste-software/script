import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {DialingEventAggregate} from "../../aggregate/events/DialingEvent";
import BranchAggregate from "../../aggregate/BranchAggregate";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {TYPE_QUEUE} from "../../valueObjects/QueueId";


@injectable()
export default class DialingEventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new DialingEventAggregate(event);

        if (!callSession.processing) this.validateFirstEvent(eventAggregate);
        else this.validateNextEvent(callSession.lastEvent!, eventAggregate);

        const callAggregate = callSession.call;
        callAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        callAggregate.forwardingToQueue(eventAggregate.event.queueId.getValue(), eventAggregate.NAME_EVENT);

        this.updateParticipantBranches(callId, clientId, eventAggregate);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }

    private updateParticipantBranches(callId: string, clientId: string, eventAggregate: DialingEventAggregate) {
        const participantsBranches = eventAggregate.getCallParticipantsBranches();

        const updateBranch = (branchNumber?: BranchNumber, typeQueue?: TYPE_QUEUE) => {
            if (!branchNumber) return;

            const branchAggregate = new BranchAggregate(branchNumber.getValue());
            branchAggregate.transitionStatus(eventAggregate.NAME_EVENT, typeQueue);
            this.callRepositoryDomain.addCallWithParticipantBranches(callId, clientId, branchAggregate);
        };

        updateBranch(participantsBranches.sourceBranchNumber);
        updateBranch(participantsBranches.destinationBranchNumber, eventAggregate.event.queueId.getTypeQueue());
    }
}
