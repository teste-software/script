import {inject, injectable} from "inversify";
import {FastifyReply, FastifyRequest} from "fastify";
import PbxCentralHistoriesRepository from "../../db/repository/PbxCentralHistoriesRepository";
import ValidateEventsUseCase from "../../../application/usecases/ValidateCallEventsUseCase";
import PbxProcessedEventsRepository from "../../db/repository/PbxProcessedEventsRepository";

@injectable()
export default class ValidateEventsController {
    constructor(
        @inject(PbxCentralHistoriesRepository) private pbxCentralHistoriesRepository: PbxCentralHistoriesRepository,
        @inject(PbxProcessedEventsRepository) private pbxProcessedEventsRepository: PbxProcessedEventsRepository,
        @inject(ValidateEventsUseCase) private validateEventsUseCase: ValidateEventsUseCase
    ) {
    }

    async validateCallId(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {call_id: callId, client_id: clientId} = request.params as { call_id: string, client_id: string };
            const eventsData = await this.pbxCentralHistoriesRepository.getEventsByCallIdAndClient(callId, clientId);

            if (!eventsData || eventsData.length === 0) {
                return reply.status(404).send({ error: 'No events found for the provided call_id and client_id' });
            }

            const responseProcessed = this.validateEventsUseCase.execute(callId, clientId, eventsData);
            reply.send({ success: true, data: responseProcessed });
        } catch (error) {
            reply.status(500).send({ error: 'An unexpected error occurred while validating the events' });
        }
    }

    async getValidateEvents(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {call_id: callId, client_id: clientId, startDate, endDate} = request.query as {
                call_id?: string,
                client_id: string,
                startDate: string,
                endDate: string
            };

            if (callId) {
                const result = await this.pbxProcessedEventsRepository.getProcessedByCallIdAndClient(callId, clientId);
                reply.send({ success: true, data: result });
            }

            const result = await this.pbxProcessedEventsRepository.getProcessedByDate(clientId, startDate, endDate);
            reply.send({ success: true, data: result });
        } catch (error) {
            reply.status(500).send({ error: 'An unexpected error occurred while validating the events' });
        }
    }
}
