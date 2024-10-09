import { CallEvent } from "./CallEvent";

export class FimAtendimentoEvent extends CallEvent {
  validateParameters(): void {
    if (!this.eventData.parameter9) {
      throw new Error("Branch number missing in FIMATENDIMENTO event");
    }
  }

  applyFsmTransition(callFsm: any, branchFsm: any): void {
    callFsm.transition(this.eventData);
    if (branchFsm) branchFsm.transition(this.eventData);
  }

  validateNextEvent(nextEvent: CallEvent): void {
    throw new Error("FimAtendimento should be the last event");
  }

  hasBranchNumber(): string | null {
    return this.eventData.parameter9;
  }
}
