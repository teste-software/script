import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../value-objects/ClientId";
import {QueueId} from "../../value-objects/QueueId";
import {QueueName} from "../../value-objects/QueueName";
import {CallWaitingTime} from "../../value-objects/CallWaitingTime";
import {CallInputTime} from "../../value-objects/CallInputTime";
import {BranchNumber} from "../../value-objects/BranchNumber";
import {NumberPhone} from "../../value-objects/NumberPhone";

export class DialingEventAggregate extends AggregateEvent {
    private reportEvent: { [k: string]: any } = {}
    NAME_EVENT = 'DISCAGEM'

    generateReport(): string {
        let report = `Relatório do Evento de Atendimento:\n`;

        report += `Cliente: ${this.reportEvent.clientId.getValue()}\n`;
        report += `Fila: ${this.reportEvent.queueName.getValue()} (ID da Fila: ${this.reportEvent.queueId.getValue()})\n`;
        report += `Horário de Entrada da Ligação: ${this.reportEvent.callInputTime.getValue()}\n`;
        report += `Tempo de Espera: ${this.reportEvent.callWaitingTime.getValue()} segundos\n`;

        switch (this.reportEvent.typeCall) {
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

        report += `Atendimento realizado com sucesso na fila "${this.reportEvent.queueName.getValue()}"\n`;

        return report;
    }

    validateParameters(): void {
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

        this.reportEvent.clientId = new ClientId(this.eventEntity.clientId);
        this.reportEvent.queueId = new QueueId(this.eventEntity.queueId);
        this.reportEvent.queueName = new QueueName(this.eventEntity.queueName);
        this.reportEvent.callWaitingTime = new CallWaitingTime(this.eventEntity.time);
        this.reportEvent.callInputTime = new CallInputTime(this.eventEntity.time);

        const isOriginatorBranchNumber = BranchNumber.isCheckBranchNumber(this.eventEntity.originator);
        const isParameterOneBranchNumber = BranchNumber.isCheckBranchNumber(this.eventEntity.parameterOne);

        if (!isOriginatorBranchNumber) {
            this.reportEvent.typeCall = 'receptive';
            this.reportEvent.phoneOrigin = new NumberPhone(this.eventEntity.originator);
            this.reportEvent.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterOne);
        } else if (isOriginatorBranchNumber && isParameterOneBranchNumber) {
            this.reportEvent.typeCall = 'internal';
            this.reportEvent.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
            this.reportEvent.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterOne);
        } else if (isOriginatorBranchNumber && !isParameterOneBranchNumber) {
            this.reportEvent.typeCall = 'active';
            this.reportEvent.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
            this.reportEvent.phoneOrigin = new NumberPhone(this.eventEntity.parameterOne);
        }
    }

    validateNextEvent(nextEvent: AggregateEvent): void {
        const validNextEvents = ["ATENDIMENTO", "FIMATENDIMENTO"];
        if (!validNextEvents.includes(nextEvent.eventEntity.nameEvent)) {
            throw new Error(`Invalid next event after DISCAGEM: ${nextEvent.eventEntity.nameEvent}`);
        }
        this.validateSequence(nextEvent);
    }

    validateSequence(nextEvent: AggregateEvent): void {
        const nextSequenceId = nextEvent.eventEntity.sequenceId
        const currentSequenceId = this.eventEntity.sequenceId
        if (nextSequenceId !== currentSequenceId + 1) {
            throw new Error(`Invalid sequence: expected ${currentSequenceId + 1}, got ${nextSequenceId}`);
        }
    }
}
