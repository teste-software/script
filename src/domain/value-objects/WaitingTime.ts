export class WaitingTime {
    private readonly value: number;
  
    constructor(value: number) {
      if (value < 0) {
        throw new Error("Waiting time cannot be negative");
      }
      this.value = value;
    }
  
    getValue(): number {
      return this.value;
    }
  }
  