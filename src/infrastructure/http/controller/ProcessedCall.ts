import {inject, injectable} from "inversify";
import {Request, Response} from 'express';
import PbxClientRepository from "../../../infrastructure/db/repository/PbxClientsRepository";
import PbxProcessedEventsRepository from "../../db/repository/PbxProcessedEventsRepository";
import ValidateEventsUseCase from "../../../application/usecases/ValidateCallEventsUseCase";
import PbxCentralHistoriesRepository from "../../db/repository/PbxCentralHistoriesRepository";
import {EventRaw} from "../../../application/dtos/events";

@injectable()
export default class ProcessedCallController {
    constructor(
        @inject(ValidateEventsUseCase) private validateEventsUseCase: ValidateEventsUseCase,
        @inject(PbxCentralHistoriesRepository) private pbxCentralHistoriesRepository: PbxCentralHistoriesRepository,
    ) {
    }

    async processedCall(request: Request, response: Response) {
        try {
            const callId = request.params.call_id;
            const clientId = request.params.client_id;

            const eventsRaw = await this.pbxCentralHistoriesRepository.getEventsByCallIdAndClient(callId, clientId);

            if (!eventsRaw || eventsRaw.length === 0) {
                response.status(200).json({ message: 'No events found' });
            }

            const callSession = this.validateEventsUseCase.execute(callId, clientId, eventsRaw as EventRaw[])

            response.status(200).json(callSession);
        } catch (error) {
            response.status(500).send({error: 'An unexpected error occurred while validating the events'});
        }
    }
}
