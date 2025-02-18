import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface TransferQueueEventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE,
        inputTime: Date,
        transferCallId: string,
    }
    branchesNumber: {
        destination?: string,
    }
}

export class TransferQueueEventMapper {
    static toDTO(rawEvent: EventRaw): TransferQueueEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.QUEUE_TRANSFER,
            sequenceId: Number(rawEvent.sequence_id),
            lastSequence: rawEvent.last_sequence === 'true',
            callId: rawEvent.call_id,
            centralId: rawEvent.central_id,
            clientId: rawEvent.client_id,
            queueId: rawEvent.queue_id,
            queueName: rawEvent.queue_name,
            callCenter: rawEvent.call_center || true,
            call: {
                type: EventDTO.getTypeQueue(rawEvent.queue_id),
                inputTime: new Date(rawEvent.time),
                transferCallId: rawEvent.parameter2 as string,
            },
            branchesNumber: {
                destination: rawEvent.number,
            }
        };

        return event
    }

    static rules() {
        return {
            clientId: (value: any) => typeof value === "string" && value.length > 0,
            queueId: (value: any) => typeof value === "string" && value.length > 0,
            centralId: (value: any) => typeof value === "string" && value.length > 0,
            callId: (value: any) => typeof value === "string" && value.length > 0,
            lastSequence: (value: any) => typeof value === "boolean",
            sequenceId: (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            queueName: (value: any) => typeof value === "string" && value.length > 0,
            "call.type": (value: any) => typeof value === "string" && value.length > 0,
            "call.inputTime": (value: any) =>  value instanceof Date && !isNaN(value.getTime()),
            "call.transferCallId": (value: any) => typeof value === "string" && value.length > 0,
            "branchesNumber.destination": (value: any, event: any) => value?.length === 6
        }
    }
}
