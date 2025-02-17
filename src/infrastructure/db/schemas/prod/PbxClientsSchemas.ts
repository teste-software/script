import {inject, injectable, named} from "inversify";
import {Collection, Db, ObjectId} from "mongodb";

export interface PbxClients {
    "_id": ObjectId,
    "active": boolean,
    "suspended": boolean,
    "name": string
}

@injectable()
export default class PbxClientsSchema {
    static PROJECTION_DEFAULT = {
        "_id": 1,
        "name": 1,
    }
    collection: Collection<PbxClients>;


    constructor(
        @inject(Db) @named('prod') private dbClientProd: Db
    ) {
        this.collection = this.dbClientProd.collection('pbx.clients');
    }

    async getActiveClientsNames() {
        return await this.collection.find({
            active: true,
            suspended: false
        }, { projection: PbxClientsSchema.PROJECTION_DEFAULT }).toArray();
    }

}
