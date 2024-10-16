export class QueueId {
    private readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error("Queue id does not exist");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    getTypeQueue(): 'internal' | 'receptive' | 'active' {
        if (this.value.includes('-ativo')) return 'active'
        if (this.value.includes('-ramal')) return 'internal'
        return 'receptive'
    }
}

