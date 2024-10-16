import {inject, injectable} from "inversify";
import { EventPbxCentralHistoriesDTO } from "../dtos/EventDTO";
import {EventMapper} from "../mappers/EventMapper";
import EventService from "../../domain/services/EventService";


@injectable()
export default class ValidateEventsUseCase {

  constructor(
      @inject(EventService) private eventService: EventService
  ) {
  }


  execute(callId: string, eventsData: EventPbxCentralHistoriesDTO[]): {[k: string]: any} {
    const eventsDomain = eventsData.map((dto) => EventMapper.toDomain(dto))

    return this.eventService.processEvents(callId, eventsDomain);
  }
}
