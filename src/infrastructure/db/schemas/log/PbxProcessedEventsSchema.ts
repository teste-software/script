import {inject, injectable, named} from "inversify";
import {Collection, Db, ObjectId} from "mongodb";
import {CallStateType} from "../../../../domain/valueObjects/CallState";
import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES} from "../../../../domain/types/EventTypes";

export interface PbxProcessedEvents {
    "_id": ObjectId,
    "call_id": string,
    "client_id": string,
    "call": {
        "queue_id": string,
        "histories_states": CallStateType[],
        "state": CallStateType,
        "errorLog": string[]
    },
    "start_date": Date,
    "branches": {
        "branch_number": string,
        "histories_states": CallStateType[],
        "state": CallStateType,
        "errorLog": string[]
    }[]
    "events": {
        "name_event": CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES,
        "parameters": {[k: string]: any},
        "errorLog": string[]
    }[]
}

@injectable()
export default class PbxProcessedEventsSchema {
    collection: Collection<PbxProcessedEvents>;

    constructor(
        @inject(Db) @named('log') private dbClientLog: Db
    ) {
        this.collection = this.dbClientLog.collection('pbx.processed.events');
    }

    async save(data: { [k: string]: any }) {
        const document = {
            "_id": new ObjectId(),
            "call_id": data.call_id,
            "client_id": data.client_id,
            "call": data.call,
            "start_date": data.start_date,
            "branches": data.branches,
            "events": data.events
        }

        await this.collection.insertOne(document);
    }

    async find(call_id: string, client_id: string): Promise<PbxProcessedEvents | null> {
        return this.collection.findOne({ call_id, client_id })
    }
}
