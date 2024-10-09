import { Call } from "../domain/entities/Call";
import { EventMapper } from "./mappers/EventMapper";
import { EventDTO } from "./dtos/EventDTO";
import { CallEventFactory } from "../domain/events/CallEventFactory";
import { CallService } from "../domain/services/CallService";
import { inject, injectable } from "inversify";

@injectable()
export class CallEventProcessor {

  constructor(
    @inject(CallService) private callService: CallService
    ) {
  }

  process(callId: string, eventsData: EventDTO[]): void {
    const call = new Call(callId);

    for (const eventDTO of eventsData) {
      const eventData = EventMapper.toDomain(eventDTO);
      const event = CallEventFactory.createEvent(eventData);
      this.callService.processEvent(call, event);
    }

    console.log(`Current state of call: ${call.getCurrentState()}`);

    // iss aqui muda
    if (eventsData[0].params.caller_number) {
        const branchNumber = eventsData[0].params.caller_number;
        console.log(`State of branch ${branchNumber}: ${call.getBranchState(branchNumber)}`);
    }
  }
}
