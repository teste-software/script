import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export enum BranchStateType {
    LOGGED_IN = 'Logado',
    LOGGED_OUT = 'Deslogado',
    PAUSED = 'Pausado',
    OCCUPIED = 'Ocupado',
    CALLING = 'Chamando',
}

export class BranchState extends ValueObject {
    readonly state: BranchStateType

    constructor(state: BranchStateType) {
        super()
        this.state = state;
    }

    getValue(): BranchStateType {
        return this.state;
    }

    canTransitionTo(nextState: BranchStateType): boolean {
        const allowedTransitions: { [key in BranchStateType]?: BranchStateType[] } = {
            [BranchStateType.LOGGED_IN]: [BranchStateType.OCCUPIED, BranchStateType.PAUSED, BranchStateType.LOGGED_OUT, BranchStateType.CALLING],
            [BranchStateType.LOGGED_OUT]: [BranchStateType.LOGGED_IN],
            [BranchStateType.PAUSED]: [BranchStateType.LOGGED_IN],
            [BranchStateType.OCCUPIED]: [BranchStateType.LOGGED_IN, BranchStateType.PAUSED, BranchStateType.OCCUPIED],
            [BranchStateType.CALLING]: [BranchStateType.OCCUPIED, BranchStateType.LOGGED_IN],
        };

        const isAllowedTransition = allowedTransitions[this.state]?.includes(nextState);
        if (!isAllowedTransition) {
            this.logError(ValueObjectErrorDetail.BRANCH_STATE, ErrorName.INVALID_TRANSITION, `Transição de estado inválida de ${this.getValue()} para ${nextState}`);
        }
        return isAllowedTransition ?? false
    }
}
