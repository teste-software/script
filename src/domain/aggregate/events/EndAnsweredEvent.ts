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

export interface EventAnsweredDomain {
    clientId: ClientId,
    queueId: QueueId,
    queueName: QueueName,
    callWaitingTime: CallWaitingTime,
    typeCall: 'receptive' | 'internal' | 'active',
    phoneOrigin?: NumberPhone,
    destinationBranchNumber?: BranchNumber,
    sourceBranchNumber?: BranchNumber,
    callAttendanceTime: CallAttendanceTime,
    branchAttendanceTime?: BranchAttendanceTime
}

export class EndAnsweredEventAggregate extends AggregateEvent {
    NAME_EVENT = CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE
    protected _event = {} as EventAnsweredDomain;
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
            typeCall: this._event.typeCall,
            phoneOrigin: this._event.phoneOrigin?.getValue(),
            destinationBranchNumber: this._event.destinationBranchNumber?.getValue(),
            sourceBranchNumber: this._event.sourceBranchNumber?.getValue(),
            callAttendanceTime: this._event.callAttendanceTime.getValue(),
            branchAttendanceTime: this._event.branchAttendanceTime?.getValue()
        };
    };

    builderParameters(): void {
        /*
         * Parâmetros de Evento de Atendimento
         * - id_cliente_externo: ID único da conta do cliente que está realizando a ligação.
         * - id_ext_fila: ID da fila onde a ligação está chamando.
         * - fila: Nome da fila onde a ligação está sendo chamada.
         *
         * Regras para Identificação do Tipo de Ligação e seus respectivos parâmetros:
         * 1. **Ligação Receptiva**:
         *    - O $event.id_ext_fila não inclui ramal ou ativo ($event.id_ext_fila.includes("ramal") && !$event.id_ext_fila.includes("ativo")).
         *    Nesse caso:
         *       > originador: número de telefone que originou a ligação.
         *       > data9: o branch_number que está recebendo a ligação.
         *       > data2: tempo de espera da ligação.
         *
         * 2. **Ligação Interna (Ramal)**:
         *    - A fila é uma fila de ramal $event.id_ext_fila.includes("ramal").
         *    Nesse caso:
         *       > originador: branch_number que originou a ligação.
         *       > data9: branch_number que recebeu a ligação.
         *       > data2: tempo de espera da ligação.
         *
         * 3. **Ligação Ativa**:
         *    - A fila é uma fila ativa $event.id_ext_fila.includes("ativo").
         *    Nesse caso:
         *       > originador: número de telefone que recebeu a ligação.
         *       > data9: branch_number do ramal que fez a ligação.
         *       > data2: tempo de espera da ligação.
         *
         * Parâmetros para Chamadas Atendidas:
         *  - **Receptiva**:
         *    > data3: tempo de atendimento.
         *    > data2: tempo de espera que a ligação ficou tocando para o ramal.
         *  - **Interna**:
         *    > data3: tempo de atendimento.
         *    > data2: tempo de espera que a ligação ficou tocando para o ramal.
         *  - **Ativa**:
         *    > data3: tempo de atendimento.
         *    > data1: tempo total da ligação (espera + atendimento).
         *    > data2: tempo de espera que a ligação ficou tocando para o ramal.
         */

        this._event.clientId = new ClientId(this.eventEntity.clientId);
        this._event.queueId = new QueueId(this.eventEntity.queueId);
        this._event.queueName = new QueueName(this.eventEntity.queueName);
        this._event.callAttendanceTime = new CallAttendanceTime(this.eventEntity.parameterThree);

        const typeCall = this._event.queueId.getTypeQueue();
        this._event.typeCall = typeCall;
        switch (typeCall) {
            case 'receptive':
                this._event.phoneOrigin = new NumberPhone(this.eventEntity.originator);
                this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                break;

            case 'internal':
                this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
                this._event.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                break;

            case 'active':
                this._event.sourceBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this._event.phoneOrigin = new NumberPhone(this.eventEntity.originator);
                this._event.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                this._event.branchAttendanceTime = new BranchAttendanceTime(this.eventEntity.parameterOne);
                break;
        }

    }
}
