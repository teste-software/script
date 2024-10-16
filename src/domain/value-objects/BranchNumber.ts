export class BranchNumber {
    private readonly value: string;

    constructor(value: string) {
        if (value.length !== 4 && value.length !== 6) {
            throw new Error("Branch Number is not valid");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    static isCheckBranchNumber(value: string) {
        return !(value.length !== 4 && value.length !== 6);

    }
}

