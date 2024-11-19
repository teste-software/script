import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class NumberPhone extends ValueObject {
    readonly value: string;

    constructor(value: string) {
        super()
        const regex = /^\d/;
        if (!regex.test(value)) {
            this.logError(ValueObjectErrorDetail.PHONE_NUMBER, ErrorName.INVALID_DATA, "Número de Telefone não aceito como número");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

