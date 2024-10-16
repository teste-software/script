import {AggregateEvent} from "./AggregateEvent";
import CallAggregate from "../CallAggregate";
import {ClientId} from "../../value-objects/ClientId";
import {QueueId} from "../../value-objects/QueueId";
import {QueueName} from "../../value-objects/QueueName";
import {NumberPhone} from "../../value-objects/NumberPhone";
import {BranchNumber} from "../../value-objects/BranchNumber";
import {CallWaitingTime} from "../../value-objects/CallWaitingTime";
import {CallAttendanceTime} from "../../value-objects/CallAttendanceTime";
import {BranchAttendanceTime} from "../../value-objects/BranchAttendanceTime";

export class EndAnsweredEventAggregate extends AggregateEvent {
    NAME_EVENT = 'FIMATENDIMENTO'
    private reportEvent: { [k: string]: any } = {}

    generateReport(): string {
        let report = `Relatório do Evento de Atendimento:\n`;

        report += `Cliente: ${this.reportEvent.clientId.getValue()}\n`;
        report += `Fila: ${this.reportEvent.queueName.getValue()} (ID da Fila: ${this.reportEvent.queueId.getValue()})\n`;
        report += `Tempo de Espera: ${this.reportEvent.callWaitingTime.getValue()} segundos\n`;

        switch (this.reportEvent.queueId.getTypeQueue()) {
            case 'receptive':
                report += `Tipo de Ligação: Receptiva\n`;
                report += `Número de Origem: ${this.reportEvent.phoneOrigin.getValue()}\n`;
                report += `Ramal que Recebeu a Ligação: ${this.reportEvent.destinationBranchNumber.getValue()}\n`;
                break;

            case 'internal':
                report += `Tipo de Ligação: Interna (Ramal)\n`;
                report += `Ramal de Origem: ${this.reportEvent.sourceBranchNumber.getValue()}\n`;
                report += `Ramal de Destino: ${this.reportEvent.destinationBranchNumber.getValue()}\n`;
                break;

            case 'active':
                report += `Tipo de Ligação: Ativa\n`;
                report += `Ramal de Origem: ${this.reportEvent.sourceBranchNumber.getValue()}\n`;
                report += `Número de Destino: ${this.reportEvent.phoneOrigin.getValue()}\n`;
                break;

            default:
                report += `Tipo de Ligação: Desconhecido\n`;
                break;
        }

        if (this.reportEvent.callAttendanceTime) {
            report += `Tempo de Atendimento: ${this.reportEvent.callAttendanceTime.getValue()} segundos\n`;
            if (this.reportEvent.branchAttendanceTime) {
                report += `Tempo de Atendimento no Ramal: ${this.reportEvent.branchAttendanceTime.getValue()} segundos\n`;
            }
        }

        return report;
    }

    validateParameters(callAggregate: CallAggregate): void {
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

        this.reportEvent.clientId = new ClientId(this.eventEntity.clientId);
        this.reportEvent.queueId = new QueueId(this.eventEntity.queueId);
        this.reportEvent.queueName = new QueueName(this.eventEntity.queueName);

        const isCallAnswered = callAggregate.isCallAnswered();
        const typeCall = this.reportEvent.queueId.getTypeQueue();

        switch (typeCall) {
            case 'receptive':
                this.reportEvent.phoneOrigin = new NumberPhone(this.eventEntity.originator);
                this.reportEvent.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this.reportEvent.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                break;

            case 'internal':
                this.reportEvent.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
                this.reportEvent.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this.reportEvent.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                break;

            case 'active':
                this.reportEvent.sourceBranchNumber = new BranchNumber(this.eventEntity.parameterNine);
                this.reportEvent.phoneOrigin = new NumberPhone(this.eventEntity.originator);
                this.reportEvent.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterTwo);
                break;

            default:
                throw new Error(`Tipo de chamada desconhecido: ${typeCall}`);
        }

        if (isCallAnswered) {
            this.reportEvent.callAttendanceTime = new CallAttendanceTime(this.eventEntity.parameterThree);

            if (typeCall === 'active') {
                this.reportEvent.branchAttendanceTime = new BranchAttendanceTime(this.eventEntity.parameterOne);
            }
        }
    }

    validateNextEvent(nextEvent: AggregateEvent): void {
        throw new Error("FimAtendimento should be the last event");
    }
}
