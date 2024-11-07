import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class CallInputTime extends ValueObject {
    readonly value: Date = new Date();

    constructor(value: number | string) {
        super();
        try {
            this.value = new Date(value);
        } catch (error: any) {
            this.logError(ValueObjectErrorDetail.CALL_INPUT_TIME, ErrorName.INVALID_DATA,"Tempo de entrada da chamada não é um tipo Data");
        }
    }

    getValue(): Date {
        return this.value;
    }
}
