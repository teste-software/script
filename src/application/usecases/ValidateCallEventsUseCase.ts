import { inject, injectable } from "inversify";
import { CallEventProcessor } from "../CallEventProcessor";
import { EventDTO } from "../dtos/EventDTO";


@injectable()
export class ValidateCallEventsUseCase {
  constructor(
    @inject(CallEventProcessor) private eventProcessor: CallEventProcessor) {
  }

  execute(callId: string, eventsData: EventDTO[]): void {
    this.eventProcessor.process(callId, eventsData);
  }
}
