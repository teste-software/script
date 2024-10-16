export class ClientId {
    private readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error("Client id does not exist");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

