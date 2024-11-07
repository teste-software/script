import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class QueueId extends ValueObject {
    readonly value: string;

    constructor(value: string) {
        super()
        if (!value) {
            this.logError(ValueObjectErrorDetail.QUEUE_ID, ErrorName.DATA_NOT_FOUND, "ID da Fila não informado");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    getTypeQueue(): 'internal' | 'receptive' | 'active' {
        if (this.value.includes('-ativo')) return 'active'
        if (this.value.includes('-ramal')) return 'internal'
        return 'receptive'
    }
}

