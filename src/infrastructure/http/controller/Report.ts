import {inject, injectable} from "inversify";
import {Request, Response} from 'express';
import PbxClientRepository from "../../../infrastructure/db/repository/PbxClientsRepository";
import PbxProcessedEventsRepository from "../../db/repository/PbxProcessedEventsRepository";

@injectable()
export default class ReportController {
    constructor(
        @inject(PbxClientRepository) private pbxClientsRepository: PbxClientRepository,
        @inject(PbxProcessedEventsRepository) private pbxProcessedEventsRepository: PbxProcessedEventsRepository
    ) {
    }


    async getActiveClientsNames(request: Request, response: Response) {
        try {
            const clients = await this.pbxClientsRepository.getActiveClientsNames();
            response.status(200).json({clients});
        } catch (error) {
            response.status(500).send({error: 'An unexpected error occurred while validating the events'});
        }
    }

    async getReportCalls(request: Request, response: Response) {
        try {
            console.log('--- auqi?', request.body)
            const {
                startDate,
                startTime,
                endDate,
                endTime,
                selectedClient,
                callId,
                onlyErrors,
            } = request.body;

            if (callId) {
                console.log('--- auqi?', callId)
                const calls = await this.pbxProcessedEventsRepository.getReportCallsByCallId(
                    callId,
                    selectedClient,
                    onlyErrors,
                );
                response.status(200).json({calls});
            }


            const calls = await this.pbxProcessedEventsRepository.getReportCallsByDate(
                startDate,
                startTime,
                endDate,
                endTime,
                selectedClient,
                onlyErrors,
            );
            response.status(200).json({calls});
        } catch (error) {
            response.status(500).send({error: 'An unexpected error occurred while validating the events'});
        }

    }
}
