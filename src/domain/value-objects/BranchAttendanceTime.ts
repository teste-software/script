export class BranchAttendanceTime {
    private readonly value: number;

    constructor(value: number | string) {
        if (typeof value === 'string') value = parseInt(value)
        if (value < 0) {
            throw new Error("Attendance time cannot be negative");
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
