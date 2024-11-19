import {injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import {AggregateEvent} from "../../aggregate/events/AggregateEvent";
import {CallSession} from "../../repository/CallRepositoryDomain";
import BaseService from "../index";
import {ErrorName, ValueObjectErrorDetail} from "../../../infrastructure/errors/CustomError";

@injectable()
export default abstract class EventService extends BaseService {
    protected isEventBranchOrCall(event: Event): "call" | "branch" {
        if ([
            'LOGIN', 'LOGOUT', 'PAUSA', 'SAIUPAUSA', 'PAUSAAGENDADA', 'PAUSACANCELADA', 'STATUS'
        ].includes(event.event)) return 'branch'

        return 'call'
    }

    protected validateFirstEvent(eventAggregate: AggregateEvent) {
        if (eventAggregate.eventEntity.sequenceId !== 1) {
            eventAggregate.logError(
                ValueObjectErrorDetail.EVENT,
                ErrorName.INVALID_SEQUENCE_ID,
                `O sequence id ${eventAggregate.eventEntity.sequenceId} é errado, expectativa é "1"`,
                eventAggregate.NAME_EVENT,
                eventAggregate.eventEntity.callId
            );
        }
        if (!['DISCAGEM', 'ENTRAURA'].includes(eventAggregate.NAME_EVENT)) {
            eventAggregate.logError(
                ValueObjectErrorDetail.EVENT,
                ErrorName.INVALID_EVENT,
                `O evento ${eventAggregate.NAME_EVENT} é invalido como entrada`,
                eventAggregate.NAME_EVENT,
                eventAggregate.eventEntity.callId
            );
        }
    }

    protected validateNextEvent(lastEventAggregate: AggregateEvent, currentEventAggregate: AggregateEvent): void {
        if (!lastEventAggregate?.NEXT_EVENTS_ALLOWED?.includes(currentEventAggregate.NAME_EVENT)) {
            currentEventAggregate.logError(
                ValueObjectErrorDetail.EVENT,
                ErrorName.INVALID_EVENT,
                `O evento ${currentEventAggregate?.NAME_EVENT} é invalido apos o evento ${lastEventAggregate?.NAME_EVENT}`,
                currentEventAggregate?.NAME_EVENT,
                currentEventAggregate?.eventEntity.callId
            );
        }
        this.validateSequence(lastEventAggregate, currentEventAggregate);
    }

    private validateSequence(lastEventAggregate: AggregateEvent, currentEventAggregate: AggregateEvent): void {
        const lastSequenceId = lastEventAggregate?.eventEntity.sequenceId;
        const currentSequenceId = currentEventAggregate?.eventEntity.sequenceId;
        if (currentSequenceId !== lastSequenceId + 1) {
            currentEventAggregate.logError(
                ValueObjectErrorDetail.EVENT,
                ErrorName.INVALID_SEQUENCE_ID,
                `O sequence id ${currentSequenceId} é errado, expectativa é "${lastSequenceId + 1}"`,
                currentEventAggregate?.NAME_EVENT,
                currentEventAggregate?.eventEntity.callId
            );
        }
    }

    abstract processEvent(callId: string, clientId: string, event: Event): CallSession
}
