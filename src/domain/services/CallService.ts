import { injectable } from "inversify";
import { Call } from "../entities/Call";
import { CallEvent } from "../events/CallEvent";


@injectable()
export class CallService {
  processEvent(call: Call, event: CallEvent): void {
    call.addEvent(event);
  }
}
