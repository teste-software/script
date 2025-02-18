import {CALLS_TYPE_EVENTS_NAMES} from "../../../domain/types/EventTypes";
import EventDTO, {InterfaceEventDTO, ValidationError, EventRaw} from "./index";

export type SelectionIVREventDTO = InterfaceEventDTO

export class SelectionIVREventMapper {
    static toDTO(rawEvent: EventRaw): SelectionIVREventDTO {
        const event = {
            event: CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR,
            sequenceId: Number(rawEvent.sequence_id),
            lastSequence: rawEvent.last_sequence === 'true',
            callId: rawEvent.call_id,
            centralId: rawEvent.central_id,
            clientId: rawEvent.client_id,
            queueId: '',
            queueName:  '',
            callCenter: rawEvent.call_center || true,
            call: {},
            branchesNumber: {}
        };

        return event
    }

    static rules() {
        return {
            clientId: (value: any) => typeof value === "string" && value.length > 0,
            centralId: (value: any) => typeof value === "string" && value.length > 0,
            callId: (value: any) => typeof value === "string" && value.length > 0,
            lastSequence: (value: any) => typeof value === "boolean",
            sequenceId: (value: any) => typeof value === "number" && !isNaN(value) && value >= 0,
        }
    }
}
