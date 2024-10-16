export class CallAttendanceTime {
    private readonly value: number;

    constructor(value: number | string) {
        if (typeof value === 'string') value = parseInt(value)
        if (value < 0) {
            throw new Error("Waiting time cannot be negative");
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
