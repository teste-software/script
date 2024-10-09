import { CallEvent } from "./CallEvent";
import { WaitingTime } from "../value-objects/WaitingTime";

export class AtendimentoEvent extends CallEvent {
  validateParameters(): void {
    const waitingTime = new WaitingTime(parseInt(this.eventData.parameter1, 10));
    console.log(`Valid waiting time: ${waitingTime.getValue()} seconds`);
  }

  applyFsmTransition(callFsm: any, branchFsm: any): void {
    callFsm.transition(this.eventData);
    if (branchFsm) branchFsm.transition(this.eventData);
  }

  validateNextEvent(nextEvent: CallEvent): void {
    if (nextEvent.eventData.event !== "FIMATENDIMENTO") {
      throw new Error(`Invalid next event after ATENDIMENTO: ${nextEvent.eventData.event}`);
    }
    this.validateSequence(nextEvent);
  }

  hasBranchNumber(): string | null {
    return this.eventData.parameter0;
  }

  validateSequence(nextEvent: CallEvent): void {
    const nextSequenceId = parseInt(nextEvent.eventData.sequence_id, 10);
    const currentSequenceId = parseInt(this.eventData.sequence_id, 10);
    if (nextSequenceId !== currentSequenceId + 1) {
      throw new Error(`Invalid sequence: expected ${currentSequenceId + 1}, got ${nextSequenceId}`);
    }
  }
}
