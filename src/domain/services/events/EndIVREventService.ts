import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {EndIVREventAggregate} from "../../aggregate/events/EndIVREvent";


@injectable()
export default class EndIVREventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new EndIVREventAggregate(event);

        this.validateNextEvent(callSession.lastEvent!, eventAggregate);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }
}
