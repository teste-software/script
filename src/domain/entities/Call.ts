import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";
import Entity from "./index";

export enum CallStateType {
    PENDING = 'Pendente',
    IN_URA = 'Em URA',
    IN_QUEUE = 'Em Fila',
    CALLING = 'Chamando',
    IN_ATTENDANCE = 'Em Atendimento',
    TRANSFERRED = 'Transferida',
    FINISHED = 'Finalizada'
}

export default class Call extends Entity {
    private readonly callId: string;
    private state: CallStateType = CallStateType.PENDING;
    public historiesStates: CallStateType[] = [ ];

    constructor(callId: string) {
        super()
        this.callId = callId;
    }

    getState(): CallStateType {
        return this.state;
    }

    applyStateTransition(nextStateType: CallStateType) {
        this.canTransitionTo(nextStateType)

        this.historiesStates.push(nextStateType);
        this.state = nextStateType;
    }

    canTransitionTo(nextState: CallStateType): boolean {
        const allowedTransitions: { [key in CallStateType]?: CallStateType[] } = {
            [CallStateType.PENDING]: [CallStateType.CALLING, CallStateType.IN_URA],
            [CallStateType.IN_URA]: [CallStateType.IN_QUEUE, CallStateType.FINISHED, CallStateType.IN_URA],
            [CallStateType.IN_QUEUE]: [CallStateType.CALLING, CallStateType.IN_QUEUE, CallStateType.FINISHED],
            [CallStateType.CALLING]: [CallStateType.IN_ATTENDANCE, CallStateType.CALLING, CallStateType.IN_QUEUE],
            [CallStateType.IN_ATTENDANCE]: [CallStateType.FINISHED],
            [CallStateType.FINISHED]: [CallStateType.FINISHED]
        };

        const isAllowedTransition =  allowedTransitions[this.state]?.includes(nextState);
        if (!isAllowedTransition) {
            this.logError(ValueObjectErrorDetail.CALL_STATE, ErrorName.INVALID_TRANSITION, `Transição de estado inválida de ${this.getValue()} para ${nextState}`);
        }
        return isAllowedTransition ?? false
    }
}
