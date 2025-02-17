import {inject, injectable} from "inversify";
import PbxProcessedEventsSchema from "../schemas/log/PbxProcessedEventsSchema";
import {CallSession} from "../../../domain/repository/CallRepositoryDomain";

@injectable()
export default class PbxProcessedEventsRepository {

    constructor(
        @inject(PbxProcessedEventsSchema) private pbxProcessedEventsSchema: PbxProcessedEventsSchema
    ) {
    }


    async getReportCallsByDate(
        startDate: string,
        startTime: string,
        endDate: string,
        endTime: string,
        selectedClient: string,
        onlyErrors: boolean,
    ) {
        const start = new Date(`${startDate}T${startTime}:00.000Z`);
        const end = new Date(`${endDate}T${endTime}:00.000Z`);

        return await this.pbxProcessedEventsSchema.findByDate(selectedClient, start, end, onlyErrors);
    }

    async getReportCallsByCallId(
        callId: string,
        selectedClient: string,
        onlyErrors: boolean,
    ) {
        return await this.pbxProcessedEventsSchema.find(callId, selectedClient, onlyErrors);
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
