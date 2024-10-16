import {CallWaitingTime} from "../../value-objects/CallWaitingTime";
import {AggregateEvent} from "./AggregateEvent";
import {ClientId} from "../../value-objects/ClientId";
import {QueueId} from "../../value-objects/QueueId";
import {NumberPhone} from "../../value-objects/NumberPhone";
import {BranchNumber} from "../../value-objects/BranchNumber";
import {CallUraTime} from "../../value-objects/CallUraTime";
import {QueueName} from "../../value-objects/QueueName";

export class AnsweredEventAggregate extends AggregateEvent {
    private reportEvent: {[k: string]: any} = {}
    NAME_EVENT = 'ATENDIMENTO'

    generateReport(): string {
        let report = `Relatório do Evento de Atendimento:\n`;

        report += `Cliente: ${this.reportEvent.clientId.getValue()}\n`;
        report += `Fila: ${this.reportEvent.queueName.getValue()} (ID da Fila: ${this.reportEvent.queueId.getValue()})\n`;

        const typeCall = this.reportEvent.queueId.getTypeQueue();
        if (typeCall === 'active') {
            report += `Tipo de Ligação: Ativa\n`;
            report += `Número Discado: ${this.reportEvent.phoneOrigin.getValue()}\n`;
        } else if (typeCall === 'internal') {
            report += `Tipo de Ligação: Interna (Ramal)\n`;
            report += `Ramal de Origem: ${this.reportEvent.sourceBranchNumber.getValue()}\n`;
            report += `Ramal de Destino: ${this.reportEvent.destinationBranchNumber.getValue()}\n`;
        } else if (typeCall === 'receptive') {
            report += `Tipo de Ligação: Receptiva\n`;
            report += `Número de Origem: ${this.reportEvent.phoneOrigin.getValue()}\n`;
            report += `Ramal de Atendimento: ${this.reportEvent.destinationBranchNumber.getValue()}\n`;
        }

        report += `Tempo de Espera: ${this.reportEvent.callWaitingTime.getValue()} segundos\n`;

        if (typeCall === 'receptive') report += `Tempo na URA: ${this.reportEvent.callUraTime.getValue()} segundos\n`;

        report += `Atendimento realizado na fila "${this.reportEvent.queueName.getValue()}" com sucesso.`;

        return report;
    }

    validateParameters(): void {
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
        this.reportEvent.clientId = new ClientId(this.eventEntity.clientId);
        this.reportEvent.queueId = new QueueId(this.eventEntity.queueId);
        this.reportEvent.queueName = new QueueName(this.eventEntity.queueName);
        this.reportEvent.destinationBranchNumber = new BranchNumber(this.eventEntity.parameterZero);
        this.reportEvent.callWaitingTime = new CallWaitingTime(this.eventEntity.parameterOne);
        this.reportEvent.callUraTime = new CallUraTime(this.eventEntity.parameterTwo);

        const typeCall = this.reportEvent.queueId.getTypeQueue();
        if (typeCall === 'active') this.reportEvent.phoneOrigin =  new NumberPhone(this.eventEntity.originator);
        if (typeCall === 'internal') this.reportEvent.sourceBranchNumber = new BranchNumber(this.eventEntity.originator);
        if (typeCall === 'receptive') this.reportEvent.phoneOrigin = new NumberPhone(this.eventEntity.originator);
    }

    validateNextEvent(nextEvent: AggregateEvent): void {
        if (nextEvent.eventEntity.nameEvent !== "FIMATENDIMENTO") {
            throw new Error(`Invalid next event after ATENDIMENTO: ${nextEvent.eventEntity.nameEvent}`);
        }
        this.validateSequence(nextEvent);
    }

    validateSequence(nextEvent: AggregateEvent): void {
        const nextSequenceId = nextEvent.eventEntity.sequenceId;
        const currentSequenceId = this.eventEntity.sequenceId;
        if (nextSequenceId !== currentSequenceId + 1) {
            throw new Error(`Invalid sequence: expected ${currentSequenceId + 1}, got ${nextSequenceId}`);
        }
    }
}
