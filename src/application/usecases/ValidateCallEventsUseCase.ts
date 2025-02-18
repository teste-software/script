import {inject, injectable} from "inversify";
import { EventRaw } from "../dtos/events";
import {EventMapper} from "../mappers/EventMapper";
import CallRepositoryDomain from "../../domain/repository/CallRepositoryDomain";
import {Logger} from "winston";
import EventsService from "../../domain/services/EventsService";


@injectable()
export default class ValidateEventsUseCase {
  constructor(
      @inject(CallRepositoryDomain) private callRepositoryDomain: CallRepositoryDomain,
      @inject('getEventsService') private getEventsService: () => EventsService,
      @inject("logger") private logger: Logger
  ) {
    this.logger.child({
      source: 'ValidateEventsUseCase'
    })
  }

  // @to-do Remover fila de redirecionamento
  execute(callId: string, clientId: string, eventsRaw: EventRaw[]) {
    let eventsDomain = eventsRaw.map((dto) => EventMapper.toDomain(dto))
    eventsDomain = eventsDomain.sort((a, b) => a.sequenceId - b.sequenceId);

    const eventsService = this.getEventsService();
    this.logger.info(`Inicializando processameto da ligação: ${callId} | ClientId: ${clientId} | Com os seguintes eventos: ${eventsDomain.map((evento) => evento.event)}`)
    try {
      eventsDomain.forEach(event => {
        eventsService.processEvent(event);
      })

      return eventsService.finishedCallSession(callId, clientId);
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
