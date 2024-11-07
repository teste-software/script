import {inject, injectable} from "inversify";
import PbxProcessedEventsSchema from "../schemas/log/PbxProcessedEventsSchema";
import {CallSession} from "../../../domain/repository/CallRepositoryDomain";

@injectable()
export default class PbxProcessedEventsRepository {

    constructor(
        @inject(PbxProcessedEventsSchema) private pbxProcessedEventsSchema: PbxProcessedEventsSchema
    ) {
    }

    async saveProcessedEvent(callSession: CallSession) {
        const callAggregate = callSession.call;
        const branchesAggregates = Object.values(callSession.branches)

        const data = {
            call_id: callSession.callId,
            client_id: callSession.clientId,
            call: {
                 queue_id: callAggregate.getQueueId(),
                 histories_states: callAggregate.callEntity.historiesStates,
                 state: callAggregate.callEntity.getState(),
                 errorLog: callAggregate.getErrors()
            },
            start_date: callSession.startDate,
            branches: branchesAggregates.map((aggregate) => ({
                branch_number: aggregate.branchEntity.getBranchNumber(),
                histories_states: aggregate.branchEntity.historiesStates,
                state: aggregate.branchEntity.getState(),
                errorLog: aggregate.getErrors()

            })),
            events: callSession.events.map((eventAggregate) => ({
                name_event: eventAggregate.NAME_EVENT,
                parameters: eventAggregate.toSummary(),
                errorLog: eventAggregate.getErrors(),
            }))
        }
        return await this.pbxProcessedEventsSchema.save(data);
    }
}
