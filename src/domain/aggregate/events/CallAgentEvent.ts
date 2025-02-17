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

export interface EventCallAgentDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationBranchNumber?: BranchNumber,
}


export class CallAgentEventAggregate extends AggregateEvent {
    protected _event = {} as EventCallAgentDomain;
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.CALL_AGENT
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.REFUSAL, CALLS_TYPE_EVENTS_NAMES.ATTENDANCE];

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
        };
    };

    builderParameters(): void {
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.typeCall = this._event.queueId.getTypeQueue();

        this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterTwo);
    }

}
