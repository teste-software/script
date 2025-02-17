import {inject, injectable} from "inversify";
import {Event} from "../../types/EventTypes";
import EventService from "./EventService";
import CallRepositoryDomain, {CallSession} from "../../repository/CallRepositoryDomain";
import {TransferQueueEventAggregate} from "../../aggregate/events/TransferQueueEvent";
import {OverflowEventAggregate} from "../../aggregate/events/OverflowEvent";


@injectable()
export default class OverflowEventService extends EventService {
    constructor(
        @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
    ) {
        super()
    }

    override processEvent(callId: string, clientId: string, event: Event): CallSession {
        const callSession = this.callRepositoryDomain.getCall(callId, clientId);
        const eventAggregate = new OverflowEventAggregate(event);

        if (!callSession.processing) this.validateFirstEvent(eventAggregate);
        else {
            const finishedProcess = this.validateNextEvent(callSession.lastEvent!, eventAggregate);
            if (!finishedProcess) return callSession;
        }

        const callAggregate = callSession.call;
        callAggregate.transitionStatus(eventAggregate.NAME_EVENT);

        this.callRepositoryDomain.addCallWithNewEvent(callId, clientId, eventAggregate);
        return callSession;
    }
}
