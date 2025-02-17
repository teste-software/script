import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {ReturnIVREventAggregate} from "../../aggregate/events/ReturnIVREvent";

@injectable()
export default class ReturnIVREventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new ReturnIVREventAggregate(event);

        const finishedProcess = this.validateNextEvent(callSession.lastEvent!, eventAggregate);
        if (!finishedProcess) return callSession;

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }
}
