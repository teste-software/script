import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {MonitoringEventAggregate} from "../../aggregate/events/MonitoringEvent";


@injectable()
export default class MonitoringEventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new MonitoringEventAggregate(event);

        const finishedProcess = this.validateNextEvent(callSession.lastEvent!, eventAggregate);
        if (!finishedProcess) return callSession;

        const callAggregate = callSession.call;
        callAggregate.transitionStatus(eventAggregate.NAME_EVENT);
        callAggregate.forwardingToQueue(eventAggregate.event.queueId.getValue(), eventAggregate.NAME_EVENT);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }
}
