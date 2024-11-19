import {AggregateEvent} from "./AggregateEvent";
import CallAggregate from "../CallAggregate";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {QueueName} from "../../valueObjects/QueueName";
import {NumberPhone} from "../../valueObjects/NumberPhone";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {CallAttendanceTime} from "../../valueObjects/CallAttendanceTime";
import {BranchAttendanceTime} from "../../valueObjects/BranchAttendanceTime";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface EventBlockageDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    sourceBranchNumber: BranchNumber,
}

export class BlockageEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.BLOCKAGE
    protected _event = {} as EventBlockageDomain;
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE];

    constructor(eventData: Event) {
        super(eventData);

        this.builderParameters();
    }

    get event() {
        return this._event
    }

    getCallParticipantsBranches() {
        return {
            sourceBranchNumber: this._event.sourceBranchNumber,
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
            sourceBranchNumber: this._event.sourceBranchNumber?.getValue(),
        };
    };

    builderParameters(): void {
        /*
         * Parâmetros de Evento de Atendimento
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         * - id_ext_fila: ID da fila onde a ligação está chamando.
         * - fila: Nome da fila onde a ligação está sendo chamada.
         * - originador: numero do ramal de origem da ligação que foi bloqueado.
         */
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);

        const typeCall = this._event.queueId.getTypeQueue();
        this._event.typeCall = typeCall;
    }
}
