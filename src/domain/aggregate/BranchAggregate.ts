import {CALLS_TYPE_EVENTS_NAMES} from "../types/EventTypes";
import Branch, {BranchStateType} from "../entities/Branch";
import {BaseAggregate} from "./index";
import {TYPE_QUEUE} from "../../application/dtos/events";

export default class BranchAggregate extends BaseAggregate {
    readonly branchEntity: Branch;

    constructor(branchNumber: string) {
        super();
        this.branchEntity = new Branch(branchNumber);
    }

    isFinished() {
        return this.branchEntity.getState() === BranchStateType.LOGGED_IN;
    }

    transitionStatus(nameEvent: CALLS_TYPE_EVENTS_NAMES, typeQueue?: TYPE_QUEUE) {
        switch (nameEvent) {
            case CALLS_TYPE_EVENTS_NAMES.TRANSFER:
                if (typeQueue === 'active') this.branchEntity.applyStateTransition(BranchStateType.OCCUPIED);
                else this.branchEntity.applyStateTransition(BranchStateType.CALLING);
                break;

            case CALLS_TYPE_EVENTS_NAMES.ENTER_IVR:
                this.branchEntity.applyStateTransition(BranchStateType.OCCUPIED);
                break;
            case CALLS_TYPE_EVENTS_NAMES.CALL_AGENT:
            case CALLS_TYPE_EVENTS_NAMES.DIALING:
                this.branchEntity.applyStateTransition(BranchStateType.CALLING);
                break;
            case CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE:
            case CALLS_TYPE_EVENTS_NAMES.ATTENDANCE:
                this.branchEntity.applyStateTransition(BranchStateType.OCCUPIED);
                break;
            case CALLS_TYPE_EVENTS_NAMES.REFUSAL:
            case CALLS_TYPE_EVENTS_NAMES.END_QUEUE_TRANSFER:
            case CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE:
            case CALLS_TYPE_EVENTS_NAMES.END_CALL:
            case CALLS_TYPE_EVENTS_NAMES.BLOCKAGE:
                this.branchEntity.applyStateTransition(BranchStateType.LOGGED_IN);
                break;
        }
    }

}
