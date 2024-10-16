export class QueueName {
    private readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error("Queue Name does not exist");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

