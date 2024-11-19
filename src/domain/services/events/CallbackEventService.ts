import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {CallbackEventAggregate} from "../../aggregate/events/CallbackEvent";


@injectable()
export default class CallbackEventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new CallbackEventAggregate(event);

        this.validateNextEvent(callSession.lastEvent!, eventAggregate);

        const callAggregate = callSession.call;
        callAggregate.forwardingToQueue(eventAggregate.event.queueId.getValue(), eventAggregate.NAME_EVENT);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }
}
