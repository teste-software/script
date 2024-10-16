import {Event, TYPES_CALL_EVENTS} from '../../types/EventTypes'
import EventEntity from "../../entities/Event";
import CallAggregate from "../CallAggregate";


export abstract class AggregateEvent {
    public NAME_EVENT: string = '';
    readonly eventEntity: EventEntity;

    constructor(eventData: Event) {
      this.eventEntity = new EventEntity(eventData);
    }

    abstract validateParameters(callAggregate?: CallAggregate): void;
    abstract validateNextEvent(nextEvent: AggregateEvent): void;
    abstract generateReport(): string;
  }
