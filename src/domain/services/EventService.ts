import {injectable} from "inversify";
import CallEventFactory from "../factories/CallEventFactory";
import {Event} from "../types/EventTypes";
import CallAggregate from "../aggregate/CallAggregate";
import {AggregateEvent} from "../aggregate/events/AggregateEvent";


@injectable()
export default class EventService {
    INDEX_FIRST_ACTION_EVENT = 0

    constructor() {
    }

    private isEventBranchOrCall(event: Event): "call" | "branch" {
        if ([
            'LOGIN', 'LOGOUT', 'PAUSA', 'SAIUPAUSA', 'PAUSAAGENDADA', 'PAUSACANCELADA', 'STATUS'
        ].includes(event.event)) return 'branch'

        return 'call'
    }

    generateFullReport(eventsAggregate: AggregateEvent[], callAggregate: CallAggregate): { [key: string]: any } {
        const fullReport: { events: any[]; call: string } = {
            events: [],
            call: callAggregate.generateReport()
        };

        for (const eventAggregate of eventsAggregate) {
            const eventReport = eventAggregate.generateReport();
            fullReport.events.push({ name: eventAggregate.NAME_EVENT , report: eventReport});
        }

        return fullReport;
    }

    processEvents(callId: string, events: Event[]): { [k: string]: any } {
        if (events.length === 0) {
            return {message: `O Call Id informado não possui eventos relacionados | | CallId: ${callId}`}
        }

        const typeEvent = this.isEventBranchOrCall(events[this.INDEX_FIRST_ACTION_EVENT])

        if (typeEvent === 'call') {
            events = events.sort((a, b) => parseInt(a.sequence_id) - parseInt(b.sequence_id));
            const callAggregate = new CallAggregate(callId);
            const eventsAggregate = [];

            try {
                for (let index = 0; index < events.length; index++) {
                    const event = events[index];
                    const eventAggregate = CallEventFactory.createEvent(event);
                    eventsAggregate.push(eventAggregate);

                    eventAggregate.validateParameters(callAggregate);
                    callAggregate.handleEvent(event.event);

                    if ((index + 1) !== events.length) {
                        const nextEvent = events[index + 1];

                        const nextEventAggregate = CallEventFactory.createEvent(nextEvent);
                        eventAggregate.validateNextEvent(nextEventAggregate);
                    }
                }

                return this.generateFullReport(eventsAggregate, callAggregate);
            } catch (error: unknown) {
                console.error(error);
                if (error instanceof Error) {
                    return { message: error.message };
                }
                return { message: `Erro desconhecido foi gerado ${error}`};
            }
        }

        return {}
    }
}
