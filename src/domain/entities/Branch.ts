import {BranchStateType, BranchState} from "../valueObjects/BranchState";
import {BranchNumber} from "../valueObjects/BranchNumber";

export default class Branch {
    private readonly branchNumber: BranchNumber;
    // @TO-DO O estado inicial deve ser pego no banco, mas como agora é apenas checar, será feito o branch_number
    private state: BranchState = new BranchState(BranchStateType.LOGGED_IN);
    public historiesStates: BranchState[] = [ ];

    constructor(branchNumber: string) {
        this.branchNumber = new BranchNumber(branchNumber);
    }

    applyStateTransition(nextStateType: BranchStateType) {
        this.state.canTransitionTo(nextStateType);

        const nextState = new BranchState(nextStateType);
        this.historiesStates.push(nextState);
        this.state = nextState;
    }

    getState(): string {
        return this.state.getValue()
    }

    getBranchNumber() {
        return this.branchNumber.getValue();
    }
}
