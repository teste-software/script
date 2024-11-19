import {inject, injectable} from "inversify";
import PbxProcessedEventsSchema from "../schemas/log/PbxProcessedEventsSchema";
import {CallSession} from "../../../domain/repository/CallRepositoryDomain";

@injectable()
export default class PbxProcessedEventsRepository {

    constructor(
        @inject(PbxProcessedEventsSchema) private pbxProcessedEventsSchema: PbxProcessedEventsSchema
    ) {
    }

    async getProcessedByCallIdAndClient(callId: string, clientId: string) {
        return await this.pbxProcessedEventsSchema.find(callId, clientId);
    }

    async getProcessedByDate(clientId: string, startDate: string, endDate: string) {
        return await this.pbxProcessedEventsSchema.findByDate(clientId, new Date(startDate), new Date(endDate));
    }

    async saveProcessedEvent(callSession: CallSession) {
        const callAggregate = callSession.call;
        const branchesAggregates = Object.values(callSession.branches)

        const data = {
            call_id: callSession.callId,
            client_id: callSession.clientId,
            call: {
                 queue_id: callAggregate.getQueueId(),
                 histories_states: callAggregate.callEntity.historiesStates.map((history) => ({
                     state: history.state,
                     errorLog: history.getErrors()
                 })),
                 state: callAggregate.callEntity.getState(),
                 errorLog: callAggregate.getErrors()
            },
            start_date: callSession.startDate,
            branches: branchesAggregates.map((aggregate) => ({
                branch_number: aggregate.branchEntity.getBranchNumber(),
                histories_states: aggregate.branchEntity.historiesStates.map((history) => ({
                    state: history.state,
                    errorLog: history.getErrors()
                })),
                state: aggregate.branchEntity.getState(),
                errorLog: aggregate.getErrors()

            })),
            events: callSession.events.map((eventAggregate) => ({
                name_event: eventAggregate.NAME_EVENT,
                parameters: {
                    values: eventAggregate.toSummary(),
                    errorLog: eventAggregate.getErrorsParameters(),
                },
                errorLog: eventAggregate.getErrors(),
            }))
        }
        return await this.pbxProcessedEventsSchema.save(data);
    }
}
