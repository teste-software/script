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

    saveProcessedEvent(callSession: CallSession) {
        const callAggregate = callSession.call;
        const branchesAggregates = Object.values(callSession.branches)

        const data = {
            call_id: callSession.callId,
            client_id: callSession.clientId,
            start_date: callSession.startDate,
            errors: callSession.errors.map((error) => error.getFormattedError()),
            lock_call: callSession.lockCall,
            events: callSession.events.map((event) => {
                return {
                    event: event.event,
                    errors: event.errors.map((error) => error.getFormattedError())
                }
            }),
            call: {
                queue_id: callAggregate.getQueueId(),
                client_id: callAggregate.getClientId(),
                state: callAggregate.callEntity.getState(),
                errors: callAggregate.getErrors(),
                histories_states: {
                    histories: callAggregate.callEntity.historiesStates,
                    errors: callAggregate.callEntity.getErrors()
                },
            },
            branches: branchesAggregates.map((aggregate) => ({
                branch_number: aggregate.branchEntity.getBranchNumber(),
                histories_states: {
                    errors: callAggregate.callEntity.getErrors(),
                    histories: aggregate.branchEntity.historiesStates
                },
                state: aggregate.branchEntity.getState(),
                errors: aggregate.getErrors()
            })),
        }

        this.pbxProcessedEventsSchema.save(data).then();
        return data;
    }
}
