import { DiscagemEvent } from "./DialingEvent";
import { AtendimentoEvent } from "./AnsweredEvent";
import { FimAtendimentoEvent } from "./EndAnsweredEvent";

export class CallEventFactory {
  static createEvent(eventData: any): any {
    switch (eventData.event) {
      case "DISCAGEM":
        return new DiscagemEvent(eventData);
      case "ATENDIMENTO":
        return new AtendimentoEvent(eventData);
      case "FIMATENDIMENTO":
        return new FimAtendimentoEvent(eventData);
      default:
        throw new Error(`Unsupported event type: ${eventData.event}`);
    }
  }
}
