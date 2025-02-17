import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {QueueName} from "../../valueObjects/QueueName";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface EventRefusalDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationBranchNumber?: BranchNumber,
}


export class RefusalEventAggregate extends AggregateEvent {
    protected _event = {} as EventRefusalDomain;
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.REFUSAL
    NEXT_EVENTS_ALLOWED = [
        CALLS_TYPE_EVENTS_NAMES.CALL_AGENT,
        CALLS_TYPE_EVENTS_NAMES.REFUSAL,
        CALLS_TYPE_EVENTS_NAMES.END_CALL,
        CALLS_TYPE_EVENTS_NAMES.ATTENDANCE,
    ];

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
        /*
         * Parâmetros de Evento de Atendimento
         *
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         * - id_ext_fila: ID da fila onde o atendimento está ocorrendo.
         * - data: Número do ramal (branch_number) que está recebendo a ligação e realizando o atendimento.
         * - data1: Tempo de espera que a ligação teve antes de ser atendida.
         * - data2: Tempo que a ligação permaneceu na URA (caso seja uma ligação receptiva); caso contrário, será 0.
         * - data7: Canal da ligação (específico do Asterisk).
         * - fila: Nome da fila onde a ligação está sendo atendida.
         *
         * Regras para Identificação do Tipo de Ligação:
         *
         * 1. **Ligação Receptiva**:
         *    - A ligação não é ativa: `!$event.id_ext_fila.includes("ativo")`
         *    - A ligação não é uma transferência: `call.transfer == false || call.transfer == 'false'`
         *    - O event.originador não é um ramal (branch_number).
         *
         *    Nesse caso, o event.originador é um número externo (DDIDDDNumberPhone), ou seja, o número de telefone que originou a ligação.
         *          > originador: número de telefone que origina a ligação
         *
         * 2. **Ligação Interna (Ramal)**:
         *    - A ligação não é ativa: `!$event.id_ext_fila.includes("ativo")`
         *    - O event.originador é um ramal (branch_number).
         *
         *    Nesse caso, o event.originador é o branch_number do ramal que originou a ligação (branch_number).
         *          > originado: branch_number do ramal que originou a ligação
         *
         * 3. **Ligação Ativa**:
         *    - A ligação é fila ativa: `!$event.id_ext_fila.includes("ativo")`
         *    - A ligação não é uma transferência: `call.transfer == false || call.transfer == 'false'`
         *
         *    Nesse caso, o event.originador é um número externo (DDIDDDNumberPhone), ou seja, o número de telefone que recebeu a ligação.
         *          > originador: número externo que recebeu a ligação
         */
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.typeCall = this._event.queueId.getTypeQueue();
        this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
    }

}
