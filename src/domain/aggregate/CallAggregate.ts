import Call, {STATES} from "../entities/Call";
import {TYPES_CALL_EVENTS} from "../types/EventTypes";

export default class CallAggregate {
    private readonly callEntity: Call;
    private reportCall: { historiesTransition: { nameEvent: string, statusPrevious: STATES, statusCurrent: STATES }[] } = {
        historiesTransition: []
    }

    constructor(callId: string) {
        this.callEntity = new Call(callId);
    }

    generateReport(): string {
        let report = `Relatório da Ligação:\n`;
        report += `Call Id: ${this.callEntity.getCallId()}`

        for (const transition of this.reportCall.historiesTransition) {
            report += `Evento: ${transition.nameEvent} \n`
            report += `O status da ligação estava ${transition.statusPrevious} e alterou para ${transition.statusCurrent}\n`
        }

        return report;
    }

    handleEvent(nameEvent: string) {
        const statusPrevious = this.callEntity.getState();
        this.callEntity.fsmStatusTransition(nameEvent as TYPES_CALL_EVENTS);
        const statusCurrent = this.callEntity.getState();

        this.reportCall.historiesTransition.push({ nameEvent: nameEvent,  statusPrevious: statusPrevious, statusCurrent: statusCurrent})
    }

    isCallAnswered(): boolean {
        return this.callEntity.checkIfThereWasStatus(STATES.IN_ATTENDANCE)
    }
}
