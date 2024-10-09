import { CallEvent } from "../events/CallEvent";
import { CallStateMachine } from "../fsm/CallStateMachine";
import { BranchStateMachine } from '../fsm/BranchStateMachine';

export class Call {
  private id: string;
  private events: CallEvent[] = [];
  private stateMachine: CallStateMachine;
  private branchStateMachines: { [branchNumber: string]: BranchStateMachine } = {};

  constructor(id: string) {
    this.id = id;
    this.stateMachine = new CallStateMachine();
  }

  addEvent(event: CallEvent): void {
    event.validateParameters();
    
    if (this.events.length > 0) {
      const previousEvent = this.events[this.events.length - 1];
      previousEvent.validateNextEvent(event);
    }

    const branchNumber = event.hasBranchNumber();
    let branchFsm: BranchStateMachine | null = null;

    if (branchNumber) {
      if (!this.branchStateMachines[branchNumber]) {
        this.branchStateMachines[branchNumber] = new BranchStateMachine(branchNumber);
      }

      branchFsm = this.branchStateMachines[branchNumber];
    }

    this.events.push(event);
    event.applyFsmTransition(this.stateMachine, branchFsm);
  }

  getCurrentState(): string {
    return this.stateMachine.getState();
  }

  getBranchState(branchNumber: string): string {
    return this.branchStateMachines[branchNumber]?.getState() || "UNAVAILABLE";
  }
}
