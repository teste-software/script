import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {QueueName} from "../../valueObjects/QueueName";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {CallIdMonitoring} from "../../valueObjects/CallIdMonitoring";

export interface EventMonitoringDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    sourceBranchNumber: BranchNumber,
    callIdMonitoring: CallIdMonitoring
}

export class MonitoringEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.MONITORING;
    protected _event = {} as EventMonitoringDomain;
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.END_MONITORING];

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
            sourceBranchNumber: this._event.sourceBranchNumber.getValue()
        };
    };

    builderParameters(): void {
        /*
         * Parâmetros de Evento de Monitoria
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         * - id_ext_fila: ID da fila onde a ligação está chamando.
         * - fila: Nome da fila onde a ligação está sendo chamada.
         * - branch_number: número do ramal que está em monitoria
         */
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);

        const typeCall = this._event.queueId.getTypeQueue();
        this._event.typeCall = typeCall;

        this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator)
        this._event.callIdMonitoring = new CallIdMonitoring(this.eventEntity.parameterTwo)
    }
}

