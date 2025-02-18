import {CALLS_TYPE_EVENTS_NAMES} from "../../domain/types/EventTypes";
import EventDTO, {EventRaw, InterfaceEventDTO, ValidationError} from "../dtos/events";
import {AnsweredEventMapper} from "../dtos/events/AnsweredEventDTO";
import {BlockageEventMapper} from "../dtos/events/BlockageEventDTO";
import {CallAgentEventMapper} from "../dtos/events/CallAgentEventDTO";
import {CallbackEventMapper} from "../dtos/events/CallbackEventDTO";
import {DialingEventMapper} from "../dtos/events/DialingEventDTO";
import {EndAnsweredEventMapper} from "../dtos/events/EndAnsweredEventDTO";
import {EndCallEventMapper} from "../dtos/events/EndCallEventDTO";
import {EndIVREventMapper} from "../dtos/events/EndIVREventDTO";
import {EndIVRTransferEventMapper} from "../dtos/events/EndIVRTransferEventDTO";
import {EndMonitoringEventMapper} from "../dtos/events/EndMonitoringEventDTO";
import {EndQueueTransferEventMapper} from "../dtos/events/EndQueueTransferEventDTO";
import {EnterIVREventMapper} from "../dtos/events/EnterIVREventDTO";
import {EnterQueueEventMapper} from "../dtos/events/EnterQueueEventDTO";
import {FinalizationEventMapper} from "../dtos/events/FinalizationEventDTO";
import {MonitoringEventMapper} from "../dtos/events/MonitoringEventDTO";
import {OverflowEventMapper} from "../dtos/events/OverflowEventDTO";
import {RefusalEventMapper} from "../dtos/events/RefusalEventDTO";
import {ReturnIVREventMapper} from "../dtos/events/ReturnIVREventDTO";
import {SelectionIVREventMapper} from "../dtos/events/SelectionIVREventDTO";
import {TransferEventMapper} from "../dtos/events/TransferEventDTO";
import {TransferIVREventMapper} from "../dtos/events/TransferIVREventDTO";
import {TransferQueueEventMapper} from "../dtos/events/TransferQueueEventDTO";
import {CustomError} from "../../infrastructure/errors/CustomError";

export class EventMapper {
    static toDomain(eventRaw: EventRaw): InterfaceEventDTO {
        if (eventRaw.queue_name === `${eventRaw.central_id}-agrupado`) {
            eventRaw.queue_id = `${eventRaw.central_id}-ramal`
        }

        switch (eventRaw.event) {
            case CALLS_TYPE_EVENTS_NAMES.ATTENDANCE:
                return AnsweredEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.BLOCKAGE:
                return BlockageEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.CALL_AGENT:
                return CallAgentEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.CALLBACK:
                return CallbackEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.DIALING:
                return DialingEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE:
                return EndAnsweredEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_CALL:
                return EndCallEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_IVR:
                return EndIVREventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_IVR_TRANSFER:
                return EndIVRTransferEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_MONITORING:
                return EndMonitoringEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.END_QUEUE_TRANSFER:
                return EndQueueTransferEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.ENTER_IVR:
                return EnterIVREventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE:
                return EnterQueueEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.FINALIZATION:
                return FinalizationEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.MONITORING:
                return MonitoringEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.OVERFLOW:
                return OverflowEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.REFUSAL:
                return RefusalEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.RETURN_IVR:
                return ReturnIVREventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR:
                return SelectionIVREventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.TRANSFER:
                return TransferEventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.IVR_TRANSFER:
                return TransferIVREventMapper.toDTO(eventRaw);
            case CALLS_TYPE_EVENTS_NAMES.QUEUE_TRANSFER:
                return TransferQueueEventMapper.toDTO(eventRaw);
            default:
                throw new Error(`Evento desconhecido: ${eventRaw.event}`);
        }
    }

    static validate(eventDTO: InterfaceEventDTO): CustomError[] {
        const strategyValidate = {
            [CALLS_TYPE_EVENTS_NAMES.ATTENDANCE]: AnsweredEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.BLOCKAGE]: BlockageEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.CALL_AGENT]: CallAgentEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.CALLBACK]: CallbackEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.DIALING]: DialingEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_ATTENDANCE]: EndAnsweredEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_CALL]: EndCallEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_IVR]: EndIVREventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_IVR_TRANSFER]: EndIVRTransferEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_MONITORING]: EndMonitoringEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.END_QUEUE_TRANSFER]: EndQueueTransferEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.ENTER_IVR]: EnterIVREventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.ENTER_QUEUE]: EnterQueueEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.FINALIZATION]: FinalizationEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.MONITORING]: MonitoringEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.OVERFLOW]: OverflowEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.REFUSAL]: RefusalEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.RETURN_IVR]: ReturnIVREventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.SELECTION_IVR]: SelectionIVREventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.TRANSFER]: TransferEventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.IVR_TRANSFER]: TransferIVREventMapper.rules(),
            [CALLS_TYPE_EVENTS_NAMES.QUEUE_TRANSFER]: TransferQueueEventMapper.rules(),
        }

        const rules = strategyValidate[eventDTO.event];
        if (!rules) {
          throw new Error(`Evento desconhecido: ${eventDTO.event}`);
        }
        return EventDTO.validate(eventDTO, rules)

    }

}
