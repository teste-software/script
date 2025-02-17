import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {NumberPhone} from "../../valueObjects/NumberPhone";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallUraTime} from "../../valueObjects/CallUraTime";
import {QueueName} from "../../valueObjects/QueueName";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";
import {CallId} from "../../valueObjects/CallId";

export interface EventTransferDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationBranchNumber?: BranchNumber,
    sourcePhone?: NumberPhone,
    callWaitingTime?: CallWaitingTime,
    callUraTime?: CallUraTime,
    sourceCallId?: CallId,
    sourceQueueId?: QueueId,
}

export class TransferEventAggregate extends AggregateEvent {
    protected _event = {} as EventTransferDomain;
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.TRANSFER
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.DIALING, CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE];

    constructor(eventData: Event) {
        super(eventData);
        this.builderParameters()
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
            typeCall: this._event.typeCall,
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            sourcePhone: this._event.sourcePhone?.getValue(),
            callWaitingTime: this._event.callWaitingTime?.getValue(),
            callUraTime: this._event.callUraTime?.getValue(),
            sourceCallId: this._event.sourceCallId?.getValue(),
            sourceQueueId: this._event.sourceQueueId?.getValue(),
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.typeCall = this._event.queueId.getTypeQueue();

        let isBranch = BranchNumber.isCheckBranchNumber(this.eventEntity.parameterOne);
        if (isBranch) this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterOne);

        if (!isBranch && this._event.typeCall === 'active') {
            isBranch = BranchNumber.isCheckBranchNumber(this.eventEntity.originator);
            if (!isBranch) return;

            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.originator);
        }

        this._event.sourcePhone = new NumberPhone(this.eventEntity.parameterOne);
        this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterFour);

        if (this._event.typeCall !== 'active') this._event.callUraTime = new CallUraTime(this.eventEntity.parameterThree);

        this._event.sourceCallId = new CallId(this.eventEntity.parameterTwo);
        this._event.sourceQueueId = new QueueId(this.eventEntity.parameterSeven);
    }

}
