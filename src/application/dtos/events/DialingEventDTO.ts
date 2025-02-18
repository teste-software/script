
import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface DialingEventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE,
        inputTime: Date,
        sourcePhone?: string,
        destinationPhone?: string,
    }
    branchesNumber: {
        destination?: string,
        source?: string,
    }
}


export class DialingEventMapper {
    static toDTO(rawEvent: EventRaw): DialingEventDTO  {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.DIALING,
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
                sourcePhone: '',
                destinationPhone: '',
            },
            branchesNumber: {
                destination: '',
                source: '',
            }
        };

        const isOriginatorBranchNumber = EventDTO.isCheckBranchNumber(rawEvent.number);
        const isParameterOneBranchNumber = EventDTO.isCheckBranchNumber(rawEvent.parameter1 as string);

        if (!isOriginatorBranchNumber) {
            event.call.type = 'receptive';
            event.call.sourcePhone = rawEvent.number;
            event.branchesNumber.destination = rawEvent.parameter0 as string;
        } else if (isOriginatorBranchNumber && isParameterOneBranchNumber) {
            event.call.type = 'internal';
            event.branchesNumber.source = rawEvent.number;
            event.branchesNumber.destination = rawEvent.parameter0 as string;
        } else if (isOriginatorBranchNumber && !isParameterOneBranchNumber) {
            event.call.type = 'active';
            event.branchesNumber.source = rawEvent.number;
            event.call.destinationPhone = rawEvent.parameter0 as string;
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
