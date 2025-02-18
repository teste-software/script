import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, EventRaw} from "./index";

export interface TransferEventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE,
        waitingTime: number,
        uraTime: number,
        sourcePhone?: string,
        transferQueueId: string,
        transferCallId: string,
    }
    branchesNumber: {
        destination?: string,
    }
}

export class TransferEventMapper {
    static toDTO(rawEvent: EventRaw): TransferEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.TRANSFER,
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
                waitingTime: 0,
                uraTime: 0,
                sourcePhone: '',
                transferQueueId: '',
                transferCallId: '',
            },
            branchesNumber: {
                destination: '',
            }
        };

        const isBranch = EventDTO.isCheckBranchNumber(rawEvent.parameter1 as string);
        if (isBranch) event.branchesNumber.destination =  rawEvent.parameter1 as string

        if (!isBranch && event.call.type === 'active') {
            event.branchesNumber.destination = rawEvent.number
        }

        event.call.sourcePhone = rawEvent.parameter1 as string;
        event.call.waitingTime = Number(rawEvent.parameter4);

        if (event.call.type !== 'active') event.call.uraTime = Number(rawEvent.parameter3);

        event.call.transferCallId = rawEvent.parameter2 as string;
        event.call.transferQueueId = rawEvent.parameter7 as string;

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
            "call.transferCallId": (value: any) => typeof value === "string" && value.length > 0,
            "call.transferQueueId": (value: any) => typeof value === "string" && value.length > 0,
            "call.waitingTime": (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            "call.uraTime": (value: any, event: any) => {
                if (event.call.type === 'active') return true;

                return typeof value === "number" && !isNaN(value) && value >= 0
            },
            "call.sourcePhone": (value: any, event: any) => {
                const regex = /^(\+?55)?(\d{2})?(\d{8,9})$/;
                return  regex.test(value)
            },
            "branchesNumber.destination": (value: any, event: any) => {
                return value?.length === 6
            }
        }
    }
}
