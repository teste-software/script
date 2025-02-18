import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";
import Entity from "./index";

export enum BranchStateType {
    LOGGED_IN = 'Logado',
    LOGGED_OUT = 'Deslogado',
    PAUSED = 'Pausado',
    OCCUPIED = 'Ocupado',
    CALLING = 'Chamando',
}

export default class Branch extends Entity {
    private readonly branchNumber: string;
    private state: BranchStateType = BranchStateType.LOGGED_IN;
    public historiesStates: BranchStateType[] = [ ];

    constructor(branchNumber: string) {
        super()
        this.branchNumber = branchNumber;
    }

    applyStateTransition(nextStateType: BranchStateType) {
        this.canTransitionTo(nextStateType);

        this.historiesStates.push(nextStateType);
        this.state = nextStateType;
    }

    getState(): BranchStateType {
        return this.state;
    }

    getBranchNumber() {
        return this.branchNumber;
    }

    canTransitionTo(nextState: BranchStateType): boolean {
        const allowedTransitions: { [key in BranchStateType]?: BranchStateType[] } = {
            [BranchStateType.LOGGED_IN]: [BranchStateType.LOGGED_IN, BranchStateType.OCCUPIED, BranchStateType.PAUSED, BranchStateType.LOGGED_OUT, BranchStateType.CALLING],
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
