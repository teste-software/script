import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {NumberPhone} from "../../valueObjects/NumberPhone";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallUraTime} from "../../valueObjects/CallUraTime";
import {QueueName} from "../../valueObjects/QueueName";
import {CallInputTime} from "../../valueObjects/CallInputTime";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface EventEnterIVRDomain {
    clientId: ClientId,
    queueId?: QueueId,
    queueName?: QueueName,
    callWaitingTime?: CallWaitingTime,
    callInputTime?: CallInputTime,
    typeCall?: 'receptive' | 'internal' | 'active',
    sourceBranchNumber?: BranchNumber,
}


export class EnterIVREventAggregate extends AggregateEvent {
    protected _event = {} as EventEnterIVRDomain;
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.ENTER_IVR
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR, CALLS_TYPE_EVENTS_NAMES.END_IVR, CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE];

    constructor(eventData: Event) {
        super(eventData);
        this.builderParameters()
    }

    get event() {
        return this._event
    }

    getCallParticipantsBranches() {
        return {
            sourceBranchNumber: this._event.sourceBranchNumber,
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
            queueId: this._event.queueId?.getValue(),
            queueName: this._event.queueName?.getValue(),
            callWaitingTime: this._event.callWaitingTime?.getValue(),
            typeCall: this._event.typeCall,
            sourceBranchNumber: this._event.sourceBranchNumber?.getValue(),
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);

        if (this.eventEntity.parameterFive === 'true' && BranchNumber.isCheckBranchNumber(this.eventEntity.originator)) {
            this._event.queueId = new QueueId(this.eventEntity.centralId + '-ramal');
            this._event.queueName = new QueueName(this.eventEntity.centralId + '-ramal');
            this._event.callInputTime = new CallInputTime(this.eventEntity.time);
            this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.time);

            this._event.typeCall = this._event.queueId.getTypeQueue();

            this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
        }
    }

}
