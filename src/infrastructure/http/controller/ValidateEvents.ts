import {inject, injectable} from "inversify";
import {FastifyReply, FastifyRequest} from "fastify";
import PbxCentralHistoriesRepository from "../../db/repository/PbxCentralHistoriesRepository";
import ValidateEventsUseCase from "../../../application/usecases/ValidateCallEventsUseCase";

@injectable()
export default class ValidateEventsController {
    constructor(
        @inject(PbxCentralHistoriesRepository) private pbxCentralHistoriesRepository: PbxCentralHistoriesRepository,
        @inject(ValidateEventsUseCase) private validateEventsUseCase: ValidateEventsUseCase
    ) {
    }

    async validateCallId(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {call_id, client_id} = request.params as { call_id: string, client_id: string };
            const eventsData = await this.pbxCentralHistoriesRepository.getEventsByCallIdAndClient(call_id, client_id);

            if (!eventsData || eventsData.length === 0) {
                return reply.status(404).send({ error: 'No events found for the provided call_id and client_id' });
            }

            const responseProcessed = this.validateEventsUseCase.execute(call_id, eventsData);
            reply.send({ success: true, data: responseProcessed });
        } catch (error) {
            reply.status(500).send({ error: 'An unexpected error occurred while validating the events' });
        }
    }
}
