import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {ObjectId} from "mongodb";
import {CustomError, ErrorName, ObjectErrorType, ValueObjectErrorDetail} from "../../../infrastructure/errors/CustomError";

export interface ValidationError {
    field: string;
    message: string;
}

export interface InterfaceEventDTO {
    event: CALLS_TYPE_EVENTS_NAMES,
    clientId: string,
    queueId: string,
    sequenceId: number,
    lastSequence: boolean,
    callId: string,
    centralId: string,
    queueName: string,
    callCenter: boolean,
    regenerated?: boolean,
    call: {
        type?: TYPE_QUEUE,
        waitingTime?: number,
        attendanceTime?: number,
        uraTime?: number,
        inputTime?: Date,
        sourcePhone?: string,
        destinationPhone?: string,
        callIdMonitoring?: string,
        forceCreated?: boolean,
        overflowQueueId?: string,
        transferQueueId?: string,
        transferCallId?: string,
    }
    branchesNumber: {
        destination?: string,
        source?: string,
    }
}

export interface EventRaw {
    "_id": ObjectId,
    "client_id": string,
    "central_id": string,
    "call_id": string,
    "call_center": boolean,
    "time": Date,
    "regenerated" : boolean,
    "event": string,
    "queue_id": string,
    "queue_name": string,
    "number": string,
    "sequence_id": string,
    "last_sequence": string,
    "parameter0": string | boolean | number,
    "parameter1": string | boolean | number,
    "parameter2": string | boolean | number,
    "parameter3": string | boolean | number,
    "parameter4": string | boolean | number,
    "parameter5": string | boolean | number,
    "parameter6": string | boolean | number,
    "parameter7": string | boolean | number,
    "parameter8": string | boolean | number,
    "parameter9": string | boolean | number,
    "carrier": string,
    "call_id_num": number,
    "sequence_id_num": number,
}


export type TYPE_QUEUE = 'internal' | 'receptive' | 'active'
export default class EventDTO {
    static isCheckBranchNumber(branchNumber: string) {
        return !(branchNumber.length !== 6);
    }

    static getTypeQueue(queueId: string): TYPE_QUEUE {
        if (queueId.includes('-ativo')) return 'active'
        if (queueId.includes('-ramal')) return 'internal'
        return 'receptive'
    }

    static validate(event: any, rules: Record<string, (value: any, event: any) => boolean>): CustomError[] {
        const errors: CustomError[] = [];

        for (const field in rules) {
            const keys = field.split('.');
            const value = keys.reduce((acc, cur) => {
                acc = acc[cur];
                return acc;
            }, event)

            if (!rules[field](value, event)) {
                const objectContextError = {
                    category: ObjectErrorType.VALUE_OBJECT,
                    detail: ValueObjectErrorDetail.EVENT,
                }
                errors.push(new CustomError(objectContextError, ErrorName.INVALID_DATA,  `Campo '${field}' inválido ou ausente.`));

            }
        }

        return errors;
    }
}
