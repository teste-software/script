import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface EventEndIVRDomain {
    clientId: ClientId,
}

export class EndIVREventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.END_IVR;
    protected _event = {} as EventEndIVRDomain;
    NEXT_EVENTS_ALLOWED = [
        CALLS_TYPE_EVENTS_NAMES.ENTER_IVR, CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR,
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
            destinationBranchNumber: null
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
        };
    };

    builderParameters(): void {
        /*
         * Parâmetros de Evento de Atendimento
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         */
        this._event.clientId = new ClientId(this.eventEntity.clientId);
    }
}

