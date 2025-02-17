import {inject, injectable} from "inversify";
import { EventPbxCentralHistoriesDTO } from "../dtos/EventDTO";
import {EventMapper} from "../mappers/EventMapper";
import EventService from "../../domain/services/events/EventService";
import CallRepositoryDomain from "../../domain/repository/CallRepositoryDomain";
import {Logger} from "winston";


@injectable()
export default class ValidateEventsUseCase {

  constructor(
      @inject('getServiceEventByName') private getServiceEventByName: (name: string) => EventService,
      @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
      @inject("logger") private logger: Logger
  ) {
    this.logger.child({
      source: 'ValidateEventsUseCase'
    })
  }

  execute(callId: string, clientId: string, eventsData: EventPbxCentralHistoriesDTO[]) {
    let eventsDomain = eventsData.map((dto) => EventMapper.toDomain(dto))
    eventsDomain = eventsDomain.sort((a, b) => parseInt(a.sequence_id) - parseInt(b.sequence_id));

    this.logger.info(`Inicializando processameto da ligação: ${callId} | ClientId: ${clientId} | Com os seguintes eventos: ${eventsDomain.map((evento) => evento.event)}`)
    try {
      for (let index = 0; index < eventsDomain.length; index++) {
        const event = eventsDomain[index];

        const service = this.getServiceEventByName(event.event);
        service.processEvent(callId, clientId, event);
      }
      this.callRepositoryDomain.forceFinishedCallSession(callId, clientId);
    } catch (error: unknown) {
      this.logger.error(error);
      if (error instanceof Error) {
        return { message: error.message };
      }
      return { message: `Erro desconhecido foi gerado ${error}`};
    } finally {
      this.logger.info(`Finalizado processamento: ${callId}`)
    }
  }
}
