import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES, Event} from '../../types/EventTypes'
import EventEntity from "../../entities/Event";
import {BaseAggregate} from "../index";


export abstract class AggregateEvent extends BaseAggregate {
    public NAME_EVENT: CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES = CALLS_TYPE_EVENTS_NAMES.DIALING;
    public NEXT_EVENTS_ALLOWED: (CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES)[] = [];
    readonly eventEntity: EventEntity;

    constructor(eventData: Event) {
        super()
        this.eventEntity = new EventEntity(eventData);
    }

    abstract builderParameters(): void;
    abstract toSummary(): { [k: string]: any };
}
