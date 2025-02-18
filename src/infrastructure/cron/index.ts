import cron from 'node-cron';
import {inject, injectable} from "inversify";
import PbxCentralHistoriesRepository from "../db/repository/PbxCentralHistoriesRepository";
import PbxClientsRepository from "../db/repository/PbxClientsRepository";
import ValidateEventsUseCase from "../../application/usecases/ValidateCallEventsUseCase";
import {EventRaw} from "../../application/dtos/events";
import {Logger} from "winston";

@injectable()
export default class CronJob {

    constructor(
        @inject(PbxCentralHistoriesRepository) private pbxCentralHistoriesRepository: PbxCentralHistoriesRepository,
        @inject(PbxClientsRepository) private pbxClientsRepository: PbxClientsRepository,
        @inject(ValidateEventsUseCase) private validateEventsUseCase: ValidateEventsUseCase,
        @inject("logger") private logger: Logger
    ) {
    }

    start() {
        this.logger.info('Cron Está Ativa');
        const task = cron.schedule('*/1 * * * *', async () =>  {
            this.logger.info('Inicializando a task da cron');

            const clients = await this.pbxClientsRepository.getActiveClientsNames();

            for (const client of clients) {
                this.logger.info(`Validando o cliente ${client.client_name} ${client.client_id}`);

                const callsToday = await this.pbxCentralHistoriesRepository.getCallIdsCron(client.client_id)

                for (const call of callsToday) {
                    this.logger.info(`Processando a ligação ${call._id} ${call.client_id}`);
                    const eventsData = await this.pbxCentralHistoriesRepository.getEventsByCallIdAndClient(
                        call._id, call.client_id);

                    if (!eventsData || eventsData.length === 0) continue;
                    this.validateEventsUseCase.execute(call._id, call.client_id, eventsData as EventRaw[]);
                }
            }
        });

        task.start();
    }
}
