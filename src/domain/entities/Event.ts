import {Event} from "../types/EventTypes";

export default class EventEntity {
    event: Event
    constructor(event: Event) {
        this.event = event
    }

    get lastSequence(): boolean {
        if (this.event.last_sequence === 'true') return true;
        if (this.event.last_sequence === 'false') return false;
        return Boolean(this.event.last_sequence)
    }

    get callId(): string {
        return this.event.call_id;
    }

    get nameEvent() {
        return this.event.event;
    }

    get centralId() {
        return this.event.central_id;
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

    get parameterFour() {
        return this.event.data4
    }

    get parameterFive() {
        return this.event.data5
    }

    get parameterSix() {
        return this.event.data6
    }

    get parameterSeven() {
        return this.event.data7
    }

    get parameterEight() {
        return this.event.data8
    }

    get parameterNine() {
        return this.event.data9
    }

    get sequenceId() {
        return parseInt(this.event.sequence_id)
    }
}
