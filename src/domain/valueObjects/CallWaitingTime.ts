import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class CallWaitingTime extends ValueObject {
    readonly value: number;

    constructor(value: number | string) {
        super()
        if (typeof value === 'string') value = parseInt(value)
        if (value < 0) {
            this.logError(ValueObjectErrorDetail.CALL_WAITING_TIME, ErrorName.INVALID_DATA, "Tempo de Espera da Chamada não pode ser negativo");
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
