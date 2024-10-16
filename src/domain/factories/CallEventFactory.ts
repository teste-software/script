import {Event} from "../types/EventTypes";
import {DialingEventAggregate} from "../aggregate/events/DialingEvent";
import {AnsweredEventAggregate} from "../aggregate/events/AnsweredEvent";
import {EndAnsweredEventAggregate} from "../aggregate/events/EndAnsweredEvent";
import {AggregateEvent} from "../aggregate/events/AggregateEvent";

export default class CallEventFactory {
    static createEvent(eventData: Event): AggregateEvent {
        switch (eventData.event) {
            case "DISCAGEM":
                return new DialingEventAggregate(eventData);
            case "ATENDIMENTO":
                return new AnsweredEventAggregate(eventData);
            case "FIMATENDIMENTO":
                return new EndAnsweredEventAggregate(eventData);
            default:
                throw new Error(`Unsupported event type: ${eventData.event}`);
        }
    }
}
