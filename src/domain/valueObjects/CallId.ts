import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class CallId extends ValueObject {
    readonly value: string;

    constructor(value: string) {
        super()
        if (!value) {
            this.logError(ValueObjectErrorDetail.CLIENT_ID, ErrorName.DATA_NOT_FOUND, "Call Id não informado");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

