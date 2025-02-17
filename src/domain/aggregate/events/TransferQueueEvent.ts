import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";
import {QueueId} from "../../valueObjects/QueueId";
import {QueueName} from "../../valueObjects/QueueName";
import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {CallAttendanceTime} from "../../valueObjects/CallAttendanceTime";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallInputTime} from "../../valueObjects/CallInputTime";
import {CallId} from "../../valueObjects/CallId";

export interface EventTransferQueueDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationBranchNumber?: BranchNumber,
    callInputTime: CallInputTime,
    sourceCallId: CallId
}

export class TransferQueueEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.QUEUE_TRANSFER;
    protected _event = {} as EventTransferQueueDomain;
    NEXT_EVENTS_ALLOWED = [
        CALLS_TYPE_EVENTS_NAMES.ENTER_IVR, CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE,
        CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE, CALLS_TYPE_EVENTS_NAMES.END_CALL
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
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
            queueName: this._event.clientId.getValue(),
            typeCall: this._event.typeCall,
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            callInputTime: this._event.callInputTime.getValue(),
            sourceCallId: this._event.sourceCallId.getValue()
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);

        this._event.typeCall = this._event.queueId.getTypeQueue();
        this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.originator);
        this._event.callInputTime = new CallInputTime(this.eventEntity.time);
        this._event.sourceCallId = new CallId(this.eventEntity.parameterTwo);
    }
}

