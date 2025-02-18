import {inject, injectable, named} from "inversify";
import {Collection, Db, ObjectId} from "mongodb";
import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES} from "../../../../domain/types/EventTypes";
import {CallStateType} from "../../../../domain/entities/Call";
import {Logger} from "winston";

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
        "parameters": { [k: string]: any },
        "errorLog": string[]
    }[],
    createdAt: Date
}

@injectable()
export default class PbxProcessedEventsSchema {
    collection: Collection<PbxProcessedEvents>;

    constructor(
        @inject(Db) @named('log') private dbClientLog: Db,
        @inject('logger') private logger: Logger,
    ) {
        this.collection = this.dbClientLog.collection('pbx.processed.events');
    }

    async save(data: { [k: string]: any }) {
        const document = {
            "call_id": data.call_id,
            "client_id": data.client_id,
            "start_date": data.start_date,
            "errors": data.errors,
            "lock_call": data.lock_call,
            "events": data.events,
            "call": data.call,
            "branches": data.branches,
            "createdAt": new Date()
        }

        this.logger.info(`Documento processado salvo ${JSON.stringify(document)}`)

        await this.collection.updateOne(
            {call_id: data.call_id, client_id: data.client_id},
            {$set: document},
            {upsert: true}
        );
    }

    async findByDate(client_id: string, start: Date, end: Date, onlyErrors?: boolean) {
        const query = {
            client_id,
            start_date: {
                $gte: start,
                $lte: end
            }
        } as { [k: string]: any };
        if (onlyErrors) query.lock_call = true;
        return this.collection.find(query).limit(20).toArray()
    }

    async find(call_id: string, client_id: string, onlyErrors?: boolean): Promise<PbxProcessedEvents[] | null> {
        const query = {
            call_id,
            client_id,
        } as { [k: string]: any };
        if (onlyErrors) query.lock_call = true;

        console.log("--- quyer", query)
        return this.collection.find(query).toArray();
    }

}
