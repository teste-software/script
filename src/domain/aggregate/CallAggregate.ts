import Call from "../entities/Call";
import {CALLS_TYPE_EVENTS_NAMES} from "../types/EventTypes";
import {QueueId} from "../valueObjects/QueueId";
import {BaseAggregate} from "./index";
import {CallStateType} from "../valueObjects/CallState";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export default class CallAggregate extends BaseAggregate {
    readonly callEntity: Call;
    private queueId: QueueId | null = null;

    constructor(callId: string) {
        super();
        this.callEntity = new Call(callId);
    }

    getQueueId() {
        return this.queueId?.getValue();
    }

    transitionStatus(nameEvent: CALLS_TYPE_EVENTS_NAMES) {
        switch (nameEvent) {
            case CALLS_TYPE_EVENTS_NAMES.DIALING:
                this.callEntity.applyStateTransition(CallStateType.CALLING);
                break;
            case CALLS_TYPE_EVENTS_NAMES.ATTENDANCE:
                this.callEntity.applyStateTransition(CallStateType.IN_ATTENDANCE);
                break;
            case CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE:
                this.callEntity.applyStateTransition(CallStateType.FINISHED);
                break;
        }
    }

    forwardingToQueue(queueId: string, nameEvent: CALLS_TYPE_EVENTS_NAMES) {
        if (!this.queueId) {
            this.queueId = new QueueId(queueId);
            return;
        }
        if (queueId === this.queueId.getValue()) return;
        if (nameEvent !== CALLS_TYPE_EVENTS_NAMES.OVERFLOW) {
            this.logError(ValueObjectErrorDetail.CALL, ErrorName.INVALID_DATA, `QueueID informado no evento ${nameEvent} é diferente da ligação`);
        }

        this.queueId = new QueueId(queueId);
    }
}
