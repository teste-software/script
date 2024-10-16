import {Event} from "../types/EventTypes";

export default class EventEntity {
    event: Event
    constructor(event: Event) {
        this.event = event
    }

    get nameEvent() {
        return this.event.event;
    }

    get clientId() {
        return this.event.client_id
    }

    get queueId() {
        return this.event.queue_id
    }

    get queueName() {
        return this.event.queue_name;
    }

    get originator() {
        return this.event.originator
    }

    get time() {
        return this.event.time
    }

    get parameterZero() {
        return this.event.data
    }

    get parameterOne() {
        return this.event.data1
    }

    get parameterTwo() {
        return this.event.data2
    }

    get parameterThree() {
        return this.event.data3
    }

    get parameterNine() {
        return this.event.data9
    }

    get sequenceId() {
        return parseInt(this.event.sequence_id)
    }
}
