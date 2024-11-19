import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES} from "../types/EventTypes";
import Branch from "../entities/Branch";
import {BranchStateType} from "../valueObjects/BranchState";
import {BaseAggregate} from "./index";
import {BranchNumber} from "../valueObjects/BranchNumber";

export default class BranchAggregate extends BaseAggregate {
    readonly branchEntity: Branch;

    constructor(branchNumber: string) {
        super();
        this.branchEntity = new Branch(branchNumber);
    }

    transitionStatus(nameEvent: CALLS_TYPE_EVENTS_NAMES) {
        switch (nameEvent) {
            case CALLS_TYPE_EVENTS_NAMES.DIALING:
            case CALLS_TYPE_EVENTS_NAMES.ATTENDANCE:
                this.branchEntity.applyStateTransition(BranchStateType.OCCUPIED);
                break;
            case CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE:
            case CALLS_TYPE_EVENTS_NAMES.BLOCKAGE:
                this.branchEntity.applyStateTransition(BranchStateType.LOGGED_IN);
                break;
        }
    }

}
