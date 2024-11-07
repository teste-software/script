import ValueObject from "./index";
import {ErrorName, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class BranchNumber  extends ValueObject {
    readonly value: string;

    constructor(value: string) {
        super()
        if (value.length !== 4 && value.length !== 6) {
            this.logError(ValueObjectErrorDetail.BRANCH_NUMBER, ErrorName.INVALID_DATA,"Numero do ramal não é aceitável");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    static isCheckBranchNumber(value: string) {
        return !(value.length !== 4 && value.length !== 6);

    }
}

