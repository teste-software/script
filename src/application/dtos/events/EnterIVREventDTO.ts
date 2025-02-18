import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import {TYPE_QUEUE} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export interface EnterIVREventDTO extends InterfaceEventDTO {
    call: {
        type: TYPE_QUEUE | undefined,
        inputTime: Date,
        forceCreated: boolean
    }
    branchesNumber: {
        source?: string,
    }
}


export class EnterIVREventMapper {
    static toDTO(rawEvent: EventRaw): EnterIVREventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.ENTER_IVR,
            sequenceId: Number(rawEvent.sequence_id),
            lastSequence: rawEvent.last_sequence === 'true',
            callId: rawEvent.call_id,
            centralId: rawEvent.central_id,
            clientId: rawEvent.client_id,
            queueId: '',
            queueName: '',
            callCenter: rawEvent.call_center || true,
            call: {
                type: undefined,
                inputTime: new Date(rawEvent.time),
                forceCreated: (rawEvent.parameter5 == 'true' || rawEvent.parameter5 == true),
            },
            branchesNumber: {
                source: '',
            }
        } as EnterIVREventDTO;

        if (event.call.forceCreated) {
            event.queueId = `${rawEvent.central_id}-ramal`;
            event.queueName = `${rawEvent.central_id}-ramal`;
            event.call.type = EventDTO.getTypeQueue(event.queueId) as TYPE_QUEUE
            event.branchesNumber.source = rawEvent.number;
        }

        return event
    }

    static rules() {
        return {
            clientId: (value: any) => typeof value === "string" && value.length > 0,
            queueId: (value: any, event: any) => {
                if (!event.call.forceCreated) return true;
                return typeof value === "string" && value.length > 0
            },
            centralId: (value: any) => typeof value === "string" && value.length > 0,
            callId: (value: any) => typeof value === "string" && value.length > 0,
            lastSequence: (value: any) => typeof value === "boolean",
            sequenceId: (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
            queueName: (value: any, event: any) => {
                if (!event.call.forceCreated) return true;
                return typeof value === "string" && value.length > 0
            },
            "call.type": (value: any, event: any) => {
                if (!event.call.forceCreated) return true;

                return typeof value === "string" && value.length > 0
            },
            "call.inputTime": (value: any, event: any) =>{
                if (!event.call.forceCreated) return true;

                return value instanceof Date && !isNaN(value.getTime())
            },
            'call.forceCreated': (value: any, event: any) => typeof value === "boolean",
            "branchesNumber.source": (value: any, event: any) => {
                if (!event.call.forceCreated) return true;

                return value?.length === 6
            }
        }
    }
}
