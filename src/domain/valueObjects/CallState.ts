import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export enum CallStateType {
    PENDING = 'Pendente',
    IN_URA = 'Em URA',
    IN_QUEUE = 'Em Fila',
    CALLING = 'Chamando',
    IN_ATTENDANCE = 'Em Atendimento',
    TRANSFERRED = 'Transferida',
    FINISHED = 'Finalizada'
}

export class CallState extends ValueObject {
    readonly state: CallStateType
    constructor(state: CallStateType) {
        super()
        this.state = state;
    }

    getValue(): CallStateType {
        return this.state;
    }

    isTerminal(): boolean {
        return this.state === CallStateType.FINISHED;
    }

    canTransitionTo(nextState: CallStateType): boolean {
        const allowedTransitions: { [key in CallStateType]?: CallStateType[] } = {
            [CallStateType.PENDING]: [CallStateType.CALLING],
            [CallStateType.CALLING]: [CallStateType.IN_ATTENDANCE, CallStateType.FINISHED],
            [CallStateType.IN_ATTENDANCE]: [CallStateType.FINISHED]
        };

        const isAllowedTransition =  allowedTransitions[this.state]?.includes(nextState);
        if (!isAllowedTransition) {
            this.logError(ValueObjectErrorDetail.CALL_STATE, ErrorName.INVALID_TRANSITION, `Transição de estado inválida de ${this.getValue()} para ${nextState}`);
        }
        return isAllowedTransition ?? false
    }
}
