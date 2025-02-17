import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../valueObjects/ClientId";
import {QueueId} from "../../valueObjects/QueueId";
import {QueueName} from "../../valueObjects/QueueName";
import {CallWaitingTime} from "../../valueObjects/CallWaitingTime";
import {CallInputTime} from "../../valueObjects/CallInputTime";
import {BranchNumber} from "../../valueObjects/BranchNumber";
import {NumberPhone} from "../../valueObjects/NumberPhone";
import {CALLS_TYPE_EVENTS_NAMES, Event} from "../../types/EventTypes";

export interface EventDialingDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    callWaitingTime: CallWaitingTime,
    callInputTime: CallInputTime,
    typeCall: 'receptive' | 'internal' | 'active',
    destinationPhone?: NumberPhone,
    sourcePhone?: NumberPhone,
    destinationBranchNumber?: BranchNumber,
    sourceBranchNumber?: BranchNumber,
}

export class DialingEventAggregate extends AggregateEvent {
    protected _event = {} as EventDialingDomain
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.DIALING
    NEXT_EVENTS_ALLOWED = [
        CALLS_TYPE_EVENTS_NAMES.ATTENDANCE, CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE,
        CALLS_TYPE_EVENTS_NAMES.BLOCKAGE
    ]

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
            destinationBranchNumber: this._event.destinationBranchNumber
        }
    }

    toSummary() {
        return {
            nameEvent: this.NAME_EVENT,
            callId: this.eventEntity.callId,
            clientId: this._event.clientId.getValue(),
            queueName: this._event.queueName.getValue(),
            callWaitingTime: this._event.callWaitingTime.getValue(),
            callInputTime: this._event.callInputTime.getValue(),
            typeCall: this._event.typeCall,
            destinationPhone: this._event.destinationPhone?.getValue(),
            sourcePhone: this._event.sourcePhone?.getValue(),
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            sourceBranchNumber: this._event.sourceBranchNumber?.getValue(),
        };
    };

    builderParameters(): void {
        /*
         * Parâmetros de Evento de Atendimento
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         * - id_ext_fila: ID da fila onde a ligação está chamando.
         * - fila: Nome da fila onde a ligação está sendo chamada.
         * - hora: Horário que entrou a ligação.
         * - data1: Tempo de espera que a ligação teve até ser atendida.
         * - data7: Canal da ligação (específico do Asterisk).
         *
         * Regras para Identificação do Tipo de Ligação e seus respectivos parâmetros:
         * 1. **Ligação Receptiva**:
         *    - O $event.originador não é um branch_number.
         *
         *    Nesse caso, o event.originador é um número externo (DDIDDDNumberPhone), ou seja, o número de telefone que originou a ligação.
         *       > originador: número de telefone que originou a ligação.
         *       > data: o branch_number que está recebendo a ligação.
         *
         * 2. **Ligação Interna (Ramal)**:
         *    - O event.originador é um ramal (branch_number).
         *    - O event.data é um ramal (branch_number).
         *
         *    Nesse caso, o event.originador é o número do ramal que originou a ligação (branch_number).
         *       > originador: branch_number que originou a ligação.
         *       > data: o branch_number que recebeu a ligação.
         *
         * 3. **Ligação Ativa**:
         *    - O event.originador é um ramal (branch_number).
         *    - O event.data não é um ramal (branch_number).
         *
         *    Nesse caso, event.originador é o número do ramal que originou a ligação (branch_number).
         *       > originador: branch_number do ramal que realizou a ligação.
         *       > data: número externo para o qual foi feita a ligação (DDIDDDNumberPhone).
         */
        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.time);
        this._event.callInputTime = new CallInputTime(this.eventEntity.time);

        const isOriginatorBranchNumber = BranchNumber.isCheckBranchNumber(this.eventEntity.originator);
        const isParameterOneBranchNumber = BranchNumber.isCheckBranchNumber(this.eventEntity.parameterOne);

        if (!isOriginatorBranchNumber) {
            this._event.typeCall = 'receptive';
            this._event.sourcePhone = new NumberPhone(this.eventEntity.originator);
            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        } else if (isOriginatorBranchNumber && isParameterOneBranchNumber) {
            this._event.typeCall = 'internal';
            this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
            this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        } else if (isOriginatorBranchNumber && !isParameterOneBranchNumber) {
            this._event.typeCall = 'active';
            this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
            this._event.destinationPhone = new NumberPhone(this.eventEntity.parameterZero);
        }
    }
}
