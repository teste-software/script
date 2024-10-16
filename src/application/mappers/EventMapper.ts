import { Event } from "../../domain/types/EventTypes";
import { EventPbxCentralHistoriesDTO } from "../dtos/EventDTO";


export class EventMapper {
  static toDomain(dto: EventPbxCentralHistoriesDTO): Event {
    return {
      id: dto._id.toString(),
      client_id: dto.client_id.toString(),
      central_id: dto.central_id.toString(),
      call_id: dto.call_id.toString(),
      time: dto.time.toString(),
      event: dto.event.toString(),
      queue_id: dto.queue_id.toString(),
      queue_name: dto.queue_name.toString(),
      originator: dto.number.toString(),
      sequence_id: dto.sequence_id.toString(),
      last_sequence: dto.last_sequence.toString(),
      data: dto.parameter0.toString(),
      data1: dto.parameter1.toString(),
      data2: dto.parameter2.toString(),
      data3: dto.parameter3.toString(),
      data4: dto.parameter4.toString(),
      data5: dto.parameter5.toString(),
      data6: dto.parameter6.toString(),
      data7: dto.parameter7.toString(),
      data8: dto.parameter8.toString(),
      data9: dto.parameter9.toString(),
    };
  }
}
