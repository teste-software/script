import cron from 'node-cron';
import {inject, injectable} from "inversify";
import PbxCentralHistoriesRepository from "../db/repository/PbxCentralHistoriesRepository";
import ValidateEventsUseCase from "../../application/usecases/ValidateCallEventsUseCase";

@injectable()
export default class CronJob {

    constructor(
        @inject(PbxCentralHistoriesRepository) private pbxCentralHistoriesRepository: PbxCentralHistoriesRepository,
        @inject(ValidateEventsUseCase) private validateEventsUseCase: ValidateEventsUseCase
    ) {
    }

    start() {
        console.log('Cron Ligada');
        const task = cron.schedule('*/1 * * * *', async () =>  {
            console.log('--- Iniciado cron');
            const result = await this.pbxCentralHistoriesRepository.getCallIdsCron()

            for (const call of result) {
                console.log(`Processando a ligação ${call._id} ${call.client_id}`);
                const eventsData = await this.pbxCentralHistoriesRepository.getEventsByCallIdAndClient(
                    call._id, call.client_id);

                if (!eventsData || eventsData.length === 0) continue;
                this.validateEventsUseCase.execute(call._id, call.client_id, eventsData);
            }
            console.log('--- Finalizado cron');
        });

        task.start();
    }
}
