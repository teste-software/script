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

export interface EventEndCallDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    callWaitingTime: CallWaitingTime,
    callAttendanceTime: CallAttendanceTime,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationBranchNumber?: BranchNumber,
}

export class EndCallEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.END_CALL
    protected _event = {} as EventEndCallDomain;
    NEXT_EVENTS_ALLOWED = [];

    constructor(eventData: Event) {
        super(eventData);

        this.builderParameters();
    }

    get event() {
        return this._event
    }

    getCallParticipantsBranches() {
        return {
            destinationBranchNumber: this._event.destinationBranchNumber
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
            queueId: this._event.queueId.getValue(),
            queueName: this._event.queueName.getValue(),
            callWaitingTime: this._event.callWaitingTime.getValue(),
            typeCall: this._event.typeCall,
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            callAttendanceTime: this._event.callAttendanceTime.getValue(),
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.typeCall = this._event.queueId.getTypeQueue();
        this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
        this._event.callAttendanceTime = new CallAttendanceTime(this.eventEntity.parameterThree);

        if (BranchNumber.isCheckBranchNumber(this.eventEntity.originator)) {
            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.originator);
        }
    }
}
