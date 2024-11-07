import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class QueueName extends ValueObject {
    readonly value: string;

    constructor(value: string) {
        super()
        if (!value) {
            this.logError(ValueObjectErrorDetail.QUEUE_NAME, ErrorName.DATA_NOT_FOUND, "Nome da Fila não informado");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}

