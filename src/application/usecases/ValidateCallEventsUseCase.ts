import {inject, injectable} from "inversify";
import { EventPbxCentralHistoriesDTO } from "../dtos/EventDTO";
import {EventMapper} from "../mappers/EventMapper";
import EventService from "../../domain/services/events/EventService";


@injectable()
export default class ValidateEventsUseCase {

  constructor(
      @inject('getServiceEventByName') private getServiceEventByName: (name: string) => EventService
  ) {
  }

  execute(callId: string, clientId: string, eventsData: EventPbxCentralHistoriesDTO[]) {
    let eventsDomain = eventsData.map((dto) => EventMapper.toDomain(dto))
    eventsDomain = eventsDomain.sort((a, b) => parseInt(a.sequence_id) - parseInt(b.sequence_id));

    try {
      for (let index = 0; index < eventsDomain.length; index++) {
        const event = eventsDomain[index];

        const service = this.getServiceEventByName(event.event);
        service.processEvent(callId, clientId, event);
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return { message: error.message };
      }
      return { message: `Erro desconhecido foi gerado ${error}`};
    }
  }
}
