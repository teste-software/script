export class CallStateMachine {
    private state: string;
  
    constructor() {
      this.state = "INITIAL";
    }
  
    transition(event: any): void {
      switch (event.event) {
        case "DISCAGEM":
          this.state = "DIALING";
          break;
        case "ATENDIMENTO":
          this.state = "IN_CALL";
          break;
        case "FIMATENDIMENTO":
          this.state = "FINISHED";
          break;
        default:
          throw new Error(`Invalid event ${event.event} for current state ${this.state}`);
      }
    }
  
    getState(): string {
      return this.state;
    }
  }
  