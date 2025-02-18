import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface EnterQueueEventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE,
        uraTime: number,
        inputTime: Date,
        sourcePhone?: string,
    }
    branchesNumber: {
        source?: string,
    }
}


export class EnterQueueEventMapper {
    static toDTO(rawEvent: EventRaw):  EnterQueueEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE,
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
                uraTime: Number(rawEvent.parameter2),
                sourcePhone: '',
            },
            branchesNumber: {
                source: '',
            }
        };

        if (EventDTO.isCheckBranchNumber(rawEvent.number)) {
            event.branchesNumber.source = rawEvent.number
        } else {
            event.call.sourcePhone = rawEvent.number
        }

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
            "call.uraTime": (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            "call.sourcePhone": (value: any, event: any) => {
                if (event.branchesNumber.source) return true;

                const regex = /^(\+?55)?(\d{2})?(\d{8,9})$/;
                return  regex.test(value)
            },
            "branchesNumber.source": (value: any, event: any) => {
                if (!value) return true;

                return value?.length === 6
            }
        }
    }
}
