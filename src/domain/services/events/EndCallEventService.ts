import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {EndAnsweredEventAggregate} from "../../aggregate/events/EndAnsweredEvent";
import {AnsweredEventAggregate} from "../../aggregate/events/AnsweredEvent";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import BranchAggregate from "../../aggregate/BranchAggregate";
import {EndCallEventAggregate} from "../../aggregate/events/EndCallEvent";
import {BranchStateType} from "../../valueObjects/BranchState";


@injectable()
export default class EndCallEventService extends EventService {

    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new EndCallEventAggregate(event);

        const finishedProcess = this.validateNextEvent(callSession.lastEvent!, eventAggregate);
        if (!finishedProcess) return callSession;

        const callAggregate = callSession.call;
        callAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        callAggregate.forwardingToQueue(eventAggregate.event.queueId.getValue(), eventAggregate.NAME_EVENT);

        this.updateParticipantBranches(callSession, eventAggregate);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }

    private updateParticipantBranches(callSession: CallSession, eventAggregate: EndCallEventAggregate) {
        const participantsBranches = eventAggregate.getCallParticipantsBranches();

        const updateBranch = (branchNumber?: string) => {
            if (!branchNumber) return;

            let branchAggregate = callSession.branches[branchNumber];
            if (!branchAggregate) {
                branchAggregate = new BranchAggregate(branchNumber);
                this.callRepositoryDomain.addCallWithParticipantBranches(callSession.callId, callSession.clientId, branchAggregate);
            }

            branchAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        };

        updateBranch(participantsBranches.destinationBranchNumber?.getValue());

        for (const branchNumber in callSession.branches) {
            const branchAggregate = callSession.branches[branchNumber];

            if (branchAggregate.branchEntity.getState() === BranchStateType['CALLING']) {
                updateBranch(callSession.branches[branchNumber].branchEntity.getBranchNumber());
            }
        }
    }
}
