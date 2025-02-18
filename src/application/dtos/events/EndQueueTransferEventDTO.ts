import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface EndQueueTransferEventDTO extends InterfaceEventDTO {
    regenerated: boolean;
    call: {
        type: TYPE_QUEUE,
        waitingTime: number,
        attendanceTime: number,
    }
    branchesNumber: {
        destination?: string,
    }
}


export class EndQueueTransferEventMapper {
    static toDTO(rawEvent: EventRaw): EndQueueTransferEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.END_QUEUE_TRANSFER,
            sequenceId: Number(rawEvent.sequence_id),
            lastSequence: rawEvent.last_sequence === 'true',
            callId: rawEvent.call_id,
            centralId: rawEvent.central_id,
            clientId: rawEvent.client_id,
            queueId: rawEvent.queue_id,
            queueName: rawEvent.queue_name,
            callCenter: rawEvent.call_center || true,
            regenerated: rawEvent.regenerated || false,
            call: {
                type: EventDTO.getTypeQueue(rawEvent.queue_id),
                waitingTime: Number(rawEvent.parameter2),
                attendanceTime: Number(rawEvent.parameter1),
            },
            branchesNumber: {
                destination: '',
            }
        };
        if (EventDTO.isCheckBranchNumber(rawEvent.number)) {
            event.branchesNumber.destination = rawEvent.number;
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
            regenerated: (value: any) => typeof value === "boolean",
            sequenceId: (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            queueName: (value: any) => typeof value === "string" && value.length > 0,
            "call.type": (value: any) => typeof value === "string" && value.length > 0,
            "call.waitingTime": (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            "call.attendanceTime": (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            "branchesNumber.destination": (value: any, event: any) => {
                if (!value) return true;

                return value?.length === 6
            }
        }
    }
}
