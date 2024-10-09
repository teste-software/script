import { Event } from '../types/EventTypes'


export abstract class CallEvent {
    readonly eventData: Event;
  
    constructor(eventData: any) {
      this.eventData = eventData;
    }
  
    abstract validateParameters(): void;
    abstract applyFsmTransition(callFsm: any, branchFsm: any): void;
    abstract validateNextEvent(nextEvent: CallEvent): void;
    abstract hasBranchNumber(): string | null;
  }
  