import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class CallUraTime extends ValueObject {
    readonly value: number;

    constructor(value: number | string) {
        super()
        if (typeof value === 'string') value = parseInt(value)
        if (value < 0) {
            this.logError(ValueObjectErrorDetail.CALL_URA_TIME, ErrorName.INVALID_DATA, "Tempo de URA da Chamada não pode ser negativo");
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}

