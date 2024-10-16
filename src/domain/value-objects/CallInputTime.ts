export class CallInputTime {
    private readonly value: Date;

    constructor(value: number | string) {
        try {
            this.value = new Date(value);
        } catch (error: any) {
            throw new Error("Call Input Time is not time");
        }
    }

    getValue(): Date {
        return this.value;
    }
}
