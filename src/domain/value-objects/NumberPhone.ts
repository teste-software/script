export class NumberPhone {
    private readonly value: string;

    constructor(value: string) {
        const regex = /^(\+?\d{2,3})?(\d{10,11})$/;
        if (!regex.test(value)) {
            throw new Error("Number is not valid");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

