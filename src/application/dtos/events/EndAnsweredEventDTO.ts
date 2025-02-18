import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface EndAnsweredEventDTO extends InterfaceEventDTO {
    regenerated: boolean;
    call: {
        type: TYPE_QUEUE,
        attendanceTime: number,
        waitingTime: number,
        sourcePhone?: string,
        destinationPhone?: string,
    }
    branchesNumber: {
        destination?: string,
        source?: string,
    }
}


export class EndAnsweredEventMapper {
    static toDTO(rawEvent: EventRaw): EndAnsweredEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE,
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
                attendanceTime: Number(rawEvent.parameter3),
                sourcePhone: '',
                destinationPhone: '',
            },
            branchesNumber: {
                destination: '',
                source: '',
            }
        };

        switch (event.call.type) {
            case 'receptive':
                event.branchesNumber.destination = rawEvent.parameter9 as string;
                event.call.sourcePhone = rawEvent.number;
                break;
            case 'internal':
                event.branchesNumber.destination = rawEvent.parameter9 as string;
                event.branchesNumber.source = rawEvent.number;
                break;

            case 'active':
                event.call.destinationPhone = rawEvent.number;
                event.branchesNumber.source = rawEvent.parameter9 as string;
                break;
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
            "call.waitingTime": (value: any) => {
                return typeof value === "number" && !isNaN(value) && value >= 0
            },
            "call.attendanceTime": (value: any) => {
                return typeof value === "number" && !isNaN(value) && value >= 0
            },
            "call.sourcePhone": (value: any, event: any) => {
                if (event.call.type !== 'receptive') return true;

                const regex = /^(\+?55)?(\d{2})?(\d{8,9})$/;
                return  regex.test(value)
            },
            "call.destinationPhone": (value: any, event: any) => {
                if (event.call.type !== 'active') return true;

                const regex = /^(\+?55)?(\d{2})?(\d{8,9})$/;
                return  regex.test(value)
            },
            "branchesNumber.destination": (value: any, event: any) => {
                if (event.call.type === 'active') return true;

                return value?.length === 6
            },
            "branchesNumber.source": (value: any, event: any) => {
                if (event.call.type === 'receptive') return true;

                return value?.length === 6
            }
        }
    }
}
