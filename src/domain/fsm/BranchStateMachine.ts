export class BranchStateMachine {
    private branchNumber: string;
    private state: string;
  
    constructor(branchNumber: string) {
      this.branchNumber = branchNumber;
      this.state = "DISPONIVEL";
    }
  
    transition(event: any): void {
      switch (event.event) {
        case "DISCAGEM":
          this.state = "TOCANDO";
          break;
        case "ATENDIMENTO":
          this.state = "EM_CHAMADA";
          break;
        case "FIMATENDIMENTO":
          this.state = "DISPONIVEL";
          break;
        default:
          throw new Error(`Invalid event ${event.event} for branch ${this.branchNumber} in state ${this.state}`);
      }
    }
  
    getState(): string {
      return this.state;
    }
  }
  