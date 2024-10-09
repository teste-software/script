import { CallEvent } from "./CallEvent";

export class DiscagemEvent extends CallEvent {
  validateParameters(): void {
    if (!this.eventData.parameter0) {
      throw new Error("Caller number missing in DISCAGEM event");
    }
  }

  applyFsmTransition(callFsm: any, branchFsm: any): void {
    callFsm.transition(this.eventData);
    if (branchFsm) branchFsm.transition(this.eventData);
  }

  validateNextEvent(nextEvent: CallEvent): void {
    const validNextEvents = ["ATENDIMENTO", "FIMATENDIMENTO"];
    if (!validNextEvents.includes(nextEvent.eventData.event)) {
      throw new Error(`Invalid next event after DISCAGEM: ${nextEvent.eventData.event}`);
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
