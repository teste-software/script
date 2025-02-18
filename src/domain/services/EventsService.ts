import {inject, injectable} from "inversify";
import CallRepositoryDomain from "../repository/CallRepositoryDomain";
import {Logger} from "winston";
import {InterfaceEventDTO} from "../../application/dtos/events";
import {EventMapper} from "../../application/mappers/EventMapper";
import BaseService from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";
import BranchAggregate from "../aggregate/BranchAggregate";


@injectable()
export default class EventsService extends BaseService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
        @inject("logger") private logger: Logger
    ) {
        super()
        this.logger.child({
            source: 'EventsService'
        })
    }

    processEvent(event: InterfaceEventDTO) {
        const callSession = this.callRepositoryDomain.getCall(event.callId, event.clientId);
        const callAggregate = callSession.call;

        const errorsDataEvent = EventMapper.validate(event);
        callSession.events.push({ event, errors: errorsDataEvent })

        if (event.regenerated) {
            this.logError(ValueObjectErrorDetail.EVENT, ErrorName.INVALID_TRANSITION, `Evento regenerado ${event.event}, não sera processado`)
            return;
        }
        if (!callSession.processing) {
            callSession.processing = true;
            if (event.sequenceId !== 1) {
                this.logError(ValueObjectErrorDetail.EVENT, ErrorName.INVALID_SEQUENCE_ID, `O evento inicial ${event.event} não inicializa o sequenceId com 1`)
            }
        }
        if (callSession.lastSequence) {
            this.logError(ValueObjectErrorDetail.EVENT, ErrorName.INVALID_EVENT, `A ligação já foi finalizada, porém o evento ${event.event} não foi processado`)
            return callSession;
        }

        const diffSequenceId = event.sequenceId - callSession.lastSequenceId;
        if (diffSequenceId !== 1) {
            this.logError(ValueObjectErrorDetail.EVENT, ErrorName.INVALID_SEQUENCE_ID, `O evento ${event.event} está com sequence ID incorreto`)
        }
        callAggregate.processedEvent(event);

        const updateBranch = (branchNumber?: string) => {
            if (!branchNumber) return;

            let branchAggregate = callSession.branches[branchNumber];
            if (!branchAggregate) {
                branchAggregate = new BranchAggregate(branchNumber);
                this.callRepositoryDomain.addCallWithParticipantBranches(callSession.callId, callSession.clientId, branchAggregate);
            }

            branchAggregate.transitionStatus(event.event);
        };

        updateBranch(event.branchesNumber?.source);
        updateBranch(event.branchesNumber?.destination);

        callSession.lastSequenceId = event.sequenceId;
        callSession.lastSequence = event.lastSequence;
        callSession.lastEvent = event;

        return callSession;
    }

    finishedCallSession(callId: string, clientId: string) {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);

        if (!callSession.lastSequence) {
            this.logError(ValueObjectErrorDetail.CALL, ErrorName.INVALID_TRANSITION, `A ligação não foi finalizada adequadamente`)
        }
        callSession.errors = this.errorLogs;


        if (!callSession.call.isFinished()) callSession.lockCall = true;

        const branchesAggregates = Object.values(callSession.branches)
        if (branchesAggregates.some(aggregate => !aggregate.isFinished())) callSession.lockCall = true;

        return this.callRepositoryDomain.forceFinishedCallSession(callId, clientId);
    }
}
