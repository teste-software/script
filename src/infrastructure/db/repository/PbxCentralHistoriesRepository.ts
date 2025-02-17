import {inject, injectable} from "inversify";
import PbxCentralHistoriesSchema from "../schemas/log/PbxCentralHistoriesSchema";


@injectable()
export default class PbxCentralHistoriesRepository {

    constructor(
        @inject(PbxCentralHistoriesSchema) private pbxCentralHistoriesSchema: PbxCentralHistoriesSchema
    ) {
    }

    async getCallIdsCron() {
        return await this.pbxCentralHistoriesSchema.getCallIdLastDay();
    }

    async getEventsByCallIdAndClient(call_id: string, client_id: string) {
        return await this.pbxCentralHistoriesSchema.findByCallId(call_id, client_id);
    }
}
