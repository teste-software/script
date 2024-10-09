import { BranchStateMachine } from "../fsm/BranchStateMachine";
import { CallEvent } from '../events/CallEvent';

export class Branch {
  private number: string;
  private stateMachine: BranchStateMachine;
  private events: CallEvent[] = [];


  constructor(number: string) {
    this.number = number;
    this.stateMachine = new BranchStateMachine(number);
  }

  handleEvent(event: CallEvent): void {
    event.validateParameters();

    if (this.events.length > 0) {
      const previousEvent = this.events[this.events.length - 1];
      previousEvent.validateNextEvent(event);
    }

    this.events.push(event);
    event.applyFsmTransition(null, this.stateMachine);
  }

  getCurrentState(): string {
    return this.stateMachine.getState();
  }
}
