import Call, {CallStateType} from "../entities/Call";
import {CALLS_TYPE_EVENTS_NAMES} from "../types/EventTypes";
import {BaseAggregate} from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";
import {InterfaceEventDTO, TYPE_QUEUE} from "../../application/dtos/events";

export default class CallAggregate extends BaseAggregate {
    readonly callEntity: Call;
    private queueId: string | null = null;
    private clientId: string | null = null;

    constructor(callId: string) {
        super();
        this.callEntity = new Call(callId);
    }

    isFinished() {
        return this.callEntity.getState() === CallStateType.FINISHED;
    }

    getQueueId(): string {
        return this.queueId!;
    }

    getClientId(): string {
        return this.clientId!
    }

    transitionStatus(nameEvent: CALLS_TYPE_EVENTS_NAMES, typeQueue?: TYPE_QUEUE) {
        switch (nameEvent) {
            case CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE:
            case CALLS_TYPE_EVENTS_NAMES.TRANSFER:
            case CALLS_TYPE_EVENTS_NAMES.QUEUE_TRANSFER:
            case CALLS_TYPE_EVENTS_NAMES.OVERFLOW:
                this.callEntity.applyStateTransition(CallStateType.IN_QUEUE);
                break
            case CALLS_TYPE_EVENTS_NAMES.ENTER_IVR:
            case CALLS_TYPE_EVENTS_NAMES.IVR_TRANSFER:
                if (typeQueue === 'internal') {
                    this.callEntity.applyStateTransition(CallStateType.IN_URA);
                    break
                }
                this.callEntity.applyStateTransition(CallStateType.IN_URA);
                break
            case CALLS_TYPE_EVENTS_NAMES.REFUSAL:
                this.callEntity.applyStateTransition(CallStateType.IN_QUEUE);
                break;
            case CALLS_TYPE_EVENTS_NAMES.CALL_AGENT:
            case CALLS_TYPE_EVENTS_NAMES.DIALING:
                this.callEntity.applyStateTransition(CallStateType.CALLING);
                break;
            case CALLS_TYPE_EVENTS_NAMES.MONITORING:
            case CALLS_TYPE_EVENTS_NAMES.ATTENDANCE:
                this.callEntity.applyStateTransition(CallStateType.IN_ATTENDANCE);
                break;
            case CALLS_TYPE_EVENTS_NAMES.END_QUEUE_TRANSFER:
            case CALLS_TYPE_EVENTS_NAMES.END_MONITORING:
            case CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE:
            case CALLS_TYPE_EVENTS_NAMES.END_CALL:
                this.callEntity.applyStateTransition(CallStateType.FINISHED);
                break;
        }
    }

    processedEvent(event: InterfaceEventDTO) {
        this.transitionStatus(event.event, event.call.type);
        this.forwardingToQueue(event.queueId ,event.event);
        this.validateEvent(event.clientId, event.event);
    }

    validateEvent(clientId: string, nameEvent: CALLS_TYPE_EVENTS_NAMES) {
        if (!this.clientId) {
            this.clientId = clientId
            return;
        }
        if (clientId === this.clientId) return;

        this.logError(ValueObjectErrorDetail.CALL, ErrorName.INVALID_DATA, `ClientID informado no evento ${nameEvent} é diferente da ligação`);
        this.clientId = clientId
    }

    forwardingToQueue(queueId: string, nameEvent: CALLS_TYPE_EVENTS_NAMES) {
        if (!this.queueId) {
            this.queueId = queueId
            return;
        }
        if (
            queueId === this.queueId ||
            [
                CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR,
                CALLS_TYPE_EVENTS_NAMES.RETURN_IVR,
                CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR,
                CALLS_TYPE_EVENTS_NAMES.END_IVR,
            ].includes(nameEvent)
        ) return;
        if (nameEvent !== CALLS_TYPE_EVENTS_NAMES.OVERFLOW) {
            this.logError(ValueObjectErrorDetail.CALL, ErrorName.INVALID_DATA, `QueueID informado no evento ${nameEvent} é diferente da ligação`);
        }

        this.queueId = queueId
    }
}
