import {inject, injectable} from "inversify";
import CallAggregate from "../aggregate/CallAggregate";
import BranchAggregate from "../aggregate/BranchAggregate";
import {AggregateEvent} from "../aggregate/events/AggregateEvent";
import PbxProcessedEventsRepository from "../../infrastructure/db/repository/PbxProcessedEventsRepository";

export interface CallSession {
    callId: string,
    clientId: string,
    call: CallAggregate,
    branches: {[k: string]: BranchAggregate },
    lastSequenceId: number,
    events: AggregateEvent[],
    lastEvent: AggregateEvent | null,
    processing: boolean,
    startDate: Date
}

@injectable()
export default class CallRepositoryDomain {

    constructor(
        @inject(PbxProcessedEventsRepository) private processedEventsRepository: PbxProcessedEventsRepository,
    ) {
    }
    callsAggregates = new Map<string, CallSession>()

    addCallWithParticipantBranches(callId: string, clientId: string, branchAggregate: BranchAggregate) {
        const key = `${callId}.${clientId}`
        const callSession = this.callsAggregates.get(key)!;

        const branchNumber = branchAggregate.branchEntity.getBranchNumber();
        callSession.branches[branchNumber] = branchAggregate;
    }

    // updae para ver a questão do last sequece para salver e deleta
    addCallWithNewEvent(callId: string, clientId: string, eventAggregate: AggregateEvent) {
        const key = `${callId}.${clientId}`
        const callSession = this.callsAggregates.get(key)!;

        callSession.events.push(eventAggregate);
        callSession.lastEvent = eventAggregate;
        callSession.lastSequenceId = eventAggregate.eventEntity.sequenceId;
        callSession.processing = true;

        if (eventAggregate.eventEntity.lastSequence) {
            this.processedEventsRepository.saveProcessedEvent(callSession);
            this.deleteCall(callId, clientId);
        }
    }

    getCall(callId: string, clientId: string): CallSession {
        const key = `${callId}.${clientId}`
        if (this.callsAggregates.has(key)) return this.callsAggregates.get(key)!;

        const callSession = {
            callId: callId,
            clientId: clientId,
            call: new CallAggregate(callId),
            branches: {},
            lastSequenceId: 0,
            events: [],
            lastEvent: null,
            processing: false,
            startDate: new Date()
        }
        this.callsAggregates.set(key, callSession)
        return callSession
    }

    deleteCall(callId: string, clientId: string) {
        const key = `${callId}.${clientId}`
        return this.callsAggregates.delete(key);
    }
}
