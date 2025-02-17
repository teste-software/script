import {inject, injectable} from "inversify";
import PbxClientsSchemas from "../schemas/prod/PbxClientsSchemas";

@injectable()
export default class PbxProcessedEventsRepository {

    constructor(
        @inject(PbxClientsSchemas) private pbxClientsSchemas: PbxClientsSchemas
    ) {
    }

    async getActiveClientsNames() {
        const clients = await this.pbxClientsSchemas.getActiveClientsNames();

        return clients.map((client) => ({
            client_id: client._id.toString(),
            client_name: client.name,
        }))
    }

}
