import {inject, injectable} from "inversify";
import CallAggregate from "../aggregate/CallAggregate";
import BranchAggregate from "../aggregate/BranchAggregate";
import PbxProcessedEventsRepository from "../../infrastructure/db/repository/PbxProcessedEventsRepository";
import {Logger} from "winston";
import {InterfaceEventDTO} from "../../application/dtos/events";
import {CustomError} from "../../infrastructure/errors/CustomError";

export interface CallSession {
    callId: string,
    clientId: string,
    lockCall: boolean,
    call: CallAggregate,
    branches: {[k: string]: BranchAggregate },
    lastSequence: boolean,
    lastSequenceId: number,
    errors: CustomError[]
    events: { event: InterfaceEventDTO, errors: CustomError[]}[],
    lastEvent: InterfaceEventDTO | undefined,
    processing: boolean,
    startDate: Date
}

@injectable()
export default class CallRepositoryDomain {

    constructor(
        @inject(PbxProcessedEventsRepository) private processedEventsRepository: PbxProcessedEventsRepository,
        @inject("logger") private logger: Logger
    ) {
    }
    callsAggregates = new Map<string, CallSession>()

    addCallWithParticipantBranches(callId: string, clientId: string, branchAggregate: BranchAggregate) {
        const key = `${callId}.${clientId}`
        const callSession = this.callsAggregates.get(key)!;

        const branchNumber = branchAggregate.branchEntity.getBranchNumber();
        callSession.branches[branchNumber] = branchAggregate;
    }

    forceFinishedCallSession(callId: string, clientId: string){
        const key = `${callId}.${clientId}`
        if (!this.callsAggregates.has(key)) return;

        const callSession = this.callsAggregates.get(key)!;
        this.deleteCall(callId, clientId);

        return this.processedEventsRepository.saveProcessedEvent(callSession);
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
            lastEvent: undefined,
            lockCall: false,
            lastSequence: false,
            processing: false,
            startDate: new Date(),
            errors: []
        }
        this.callsAggregates.set(key, callSession)
        return callSession
    }

    deleteCall(callId: string, clientId: string) {
        const key = `${callId}.${clientId}`
        return this.callsAggregates.delete(key);
    }
}
