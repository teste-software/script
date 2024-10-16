import {inject, injectable, named} from "inversify";
import {Collection, Db, ObjectId} from "mongodb";

export interface PbxCentralHistories {
    "_id": ObjectId,
    "client_id": string,
    "central_id": string,
    "call_id": string,
    "time": Date,
    "event": string,
    "queue_id": string,
    "queue_name": string,
    "number": string,
    "sequence_id": string,
    "last_sequence": string,
    "parameter0": string,
    "parameter1": string,
    "parameter2": string,
    "parameter3": string,
    "parameter4": string,
    "parameter5": string,
    "parameter6": string,
    "parameter7": string,
    "parameter8": string,
    "parameter9": string,
    "carrier": string,
    "call_id_num": number,
    "sequence_id_num": number,
}

@injectable()
export default class PbxCentralHistoriesSchema {
    static PROJECTION_DEFAULT = {
        "_id": 1,
        "client_id": 1,
        "central_id": 1,
        "call_id": 1,
        "time": 1,
        "event": 1,
        "queue_id": 1,
        "queue_name": 1,
        "number": 1,
        "sequence_id": 1,
        "last_sequence": 1,
        "parameter0": 1,
        "parameter1": 1,
        "parameter2": 1,
        "parameter3": 1,
        "parameter4": 1,
        "parameter5": 1,
        "parameter6": 1,
        "parameter7": 1,
        "parameter8": 1,
        "parameter9": 1,
        "carrier": 1,
        "call_id_num": 1,
        "sequence_id_num": 1,
    }
    collection: Collection<PbxCentralHistories>;


    constructor(
        @inject(Db) @named('log') private dbClientLog: Db
    ) {
        this.collection = this.dbClientLog.collection('pbx.central.histories');
    }

    async findByCallId(call_id: string, client_id: string): Promise<PbxCentralHistories[]> {
        const query = {
            client_id: client_id,
            call_id: call_id,
            event: {
                $in: [
                    'DISCAGEM',
                    'ATENDIMENTO',
                    'FIMATENDIMENTO'
                ]
            }
        };
        const options = {
            projection: PbxCentralHistoriesSchema.PROJECTION_DEFAULT
        }

        if ((await this.collection.countDocuments(query)) === 0) {
            return []
        }

        const cursor = this.collection.find(query, options);

        const histories = []
        for await (const doc of cursor) {
            histories.push(doc as PbxCentralHistories)
        }

        return histories
    }
}
