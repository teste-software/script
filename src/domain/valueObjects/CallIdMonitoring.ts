import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class CallIdMonitoring extends ValueObject {
    readonly value: number | string;

    constructor(value: number | string) {
        super()
        if (!value) {
            this.logError(ValueObjectErrorDetail.CALL_ID_MONITORING, ErrorName.DATA_NOT_FOUND,"Call id da ligação monitorada não foi informada");
        }
        this.value = value;
    }

    getValue(): number | string {
        return this.value;
    }
}
