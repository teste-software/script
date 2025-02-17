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
    }[],
    createdAt: Date
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
            "call_id": data.call_id,
            "client_id": data.client_id,
            "call": data.call,
            "start_date": data.start_date,
            "branches": data.branches,
            "events": data.events,
            "createdAt": new Date()
        }

        await this.collection.updateOne(
            { call_id: data.call_id, client_id: data.client_id },
            { $set: document },
            { upsert: true }
        );
    }

    async findByDate(client_id: string, start: Date, end: Date, onlyErrors?: boolean) {
        return this.collection.find({ client_id, start_date: {
                $gte: start,
                $lte: end
            }
            // ,
            // $or: [
                // { "call.state": { $ne: "Finalizada" } },
                // { "call.errorLog": { $exists: true, $not: { $size: 0 } } },

                // { "branches.errorLog": { $exists: true, $not: { $size: 0 } } },
                // { "branches.histories_states.errorLog": { $exists: true, $not: { $size: 0 } } },
                // { "events.errorLog": { $exists: true, $not: { $size: 0 } } },
                // { "events.parameters.errorLog": { $exists: true, $not: { $size: 0 } } }
            // ]
        }).limit(20).toArray()
    }
    async find(call_id: string, client_id: string, onlyErrors?: boolean): Promise<PbxProcessedEvents[] | null> {
        return this.collection.find({
            call_id,
            client_id,
            $or: [
                // Verifica se o estado da chamada principal não é "Finalizada"
                // { "call.state": { $ne: "Finalizada" } },

                // Verifica se o errorLog da chamada principal não está vazio
                { "call.errorLog": { $exists: true, $not: { $size: 0 } } },

                // Verifica se algum branch tem estado diferente de "Logado"
                { branches: { $elemMatch: { state: { $ne: "Logado" } } } },

                // Verifica se algum branch tem errorLog não vazio
                { branches: { $elemMatch: { errorLog: { $exists: true, $not: { $size: 0 } } } } },

                // Verifica se algum histories_states em qualquer branch tem errorLog não vazio
                { branches: { $elemMatch: { histories_states: { $elemMatch: { errorLog: { $exists: true, $not: { $size: 0 } } } } } } },

                // Verifica se algum evento tem errorLog não vazio
                { events: { $elemMatch: { errorLog: { $exists: true, $not: { $size: 0 } } } } },

                // Verifica se algum errorLog nos parâmetros de qualquer evento não está vazio
                { events: { $elemMatch: { "parameters.errorLog": { $exists: true, $not: { $size: 0 } } } } }
            ]
        }).toArray();
    }

}
