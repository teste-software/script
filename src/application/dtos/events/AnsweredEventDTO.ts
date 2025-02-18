import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, EventRaw} from "./index";

export interface AnsweredEventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE,
        waitingTime: number,
        uraTime: number,
        sourcePhone?: string,
        destinationPhone?: string,
    }
    branchesNumber: {
        destination?: string,
        source?: string,
    }
}


export class AnsweredEventMapper {
    static toDTO(rawEvent: EventRaw): AnsweredEventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.ATTENDANCE,
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
                waitingTime: Number(rawEvent.parameter1),
                uraTime: Number(rawEvent.parameter2),
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
                event.branchesNumber.destination = rawEvent.parameter0 as string;
                event.call.sourcePhone = rawEvent.number;
                break;

            case 'internal':
                if (rawEvent.number.length === 6) {
                    event.branchesNumber.destination = rawEvent.parameter0 as string;
                    event.branchesNumber.source = rawEvent.number;
                } else {
                    event.call.type = 'receptive';
                    event.branchesNumber.destination = rawEvent.parameter0 as string;
                    event.call.sourcePhone = rawEvent.number;
                }
                break;

            case 'active':
                event.call.destinationPhone = rawEvent.number;
                event.branchesNumber.source = rawEvent.parameter0 as string;
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
            sequenceId: (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            queueName: (value: any) => typeof value === "string" && value.length > 0,
            "call.type": (value: any) => typeof value === "string" && value.length > 0,
            "call.waitingTime": (value: any) => {
                return typeof value === "number" && !isNaN(value) && value >= 0
            },
            "call.uraTime": (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
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

                return value?.length === 4 || value?.length === 6
            },
            "branchesNumber.source": (value: any, event: any) => {
                if (event.call.type === 'receptive') return true;

                return value?.length === 4 || value?.length === 6
            }
        }
    }
}
