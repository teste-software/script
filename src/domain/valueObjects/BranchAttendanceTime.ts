import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class BranchAttendanceTime extends ValueObject {
    readonly value: number;

    constructor(value: number | string) {
        super()
        if (typeof value === 'string') value = parseInt(value)
        if (value < 0) {
            this.logError(ValueObjectErrorDetail.BRANCH_ATTENDANCE_TIME, ErrorName.INVALID_DATA,"Tempo de Atendimento do ramal não pode ser negativo");
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
