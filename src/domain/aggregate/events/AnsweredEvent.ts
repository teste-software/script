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

export interface EventAnsweredDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    callWaitingTime: CallWaitingTime,
    callUraTime: CallUraTime,
    typeCall: 'receptive' | 'internal' | 'active',
    phoneOrigin: NumberPhone,
    destinationBranchNumber?: BranchNumber,
    sourceBranchNumber?: BranchNumber,
}


export class AnsweredEventAggregate extends AggregateEvent {
    private _event = {} as EventAnsweredDomain;
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.ATTENDANCE
    NEXT_EVENTS_ALLOWED = [CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE];

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
            callUraTime: this._event.callUraTime.getValue(),
            typeCall: this._event.typeCall,
            phoneOrigin: this._event.phoneOrigin.getValue(),
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            sourceBranchNumber: this._event.sourceBranchNumber?.getValue(),
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
        this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterOne);
        this._event.callUraTime = new CallUraTime(this.eventEntity.parameterTwo);

        const typeCall = this._event.queueId.getTypeQueue();
        this._event.typeCall = typeCall;
        if (typeCall === 'active') {
            this._event.phoneOrigin =  new NumberPhone(this.eventEntity.originator);
            this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        }
        if (typeCall === 'internal') {
            this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        }
        if (typeCall === 'receptive') {
            this._event.phoneOrigin = new NumberPhone(this.eventEntity.originator);
            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        }
    }

}
