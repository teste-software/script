import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {QueueName} from "../../valueObjects/QueueName";
import {NumberPhone} from "../../valueObjects/NumberPhone";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {CallAttendanceTime} from "../../valueObjects/CallAttendanceTime";
import {BranchAttendanceTime} from "../../valueObjects/BranchAttendanceTime";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface OverflowDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    sourceQueueId: QueueId,
}

export class OverflowEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.OVERFLOW;
    protected _event = {} as OverflowDomain;
    NEXT_EVENTS_ALLOWED = [
        CALLS_TYPE_EVENTS_NAMES.CALL_AGENT, CALLS_TYPE_EVENTS_NAMES.END_CALL,
        CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE
    ];

    constructor(eventData: Event) {
        super(eventData);

        this.builderParameters();
    }

    get event() {
        return this._event
    }

    getCallParticipantsBranches() {
        return {
            sourceBranchNumber: null,
            destinationBranchNumber: null
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
            queueId: this._event.queueId.getValue(),
            queueName: this._event.queueName.getValue(),
            typeCall: this._event.typeCall,
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.typeCall = this._event.queueId.getTypeQueue();

        this._event.sourceQueueId = new QueueId(this.eventEntity.parameterFive);
    }
}
