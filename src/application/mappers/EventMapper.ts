import { Event } from "../../domain/types/EventTypes";
import { EventDTO } from "../dtos/EventDTO";


export class EventMapper {
  static toDomain(dto: EventDTO): Event {
    return {
      event: dto.event_type,
      sequence_id: dto.sequence.toString(),
      parameter0: dto.params.caller_number || "",
      parameter1: dto.params.wait_time?.toString() || "",
      parameter9: dto.params.agent_id?.toString() || ""
    };
  }
}
