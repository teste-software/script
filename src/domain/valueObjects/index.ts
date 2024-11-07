import {CustomError, ErrorName, ObjectErrorType, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export default class ValueObject {
     readonly value: any;
     protected errorLogs: CustomError[] = [];

     getValue(): any {
          return this.value;
     }

     protected logError(valueObject: ValueObjectErrorDetail, errorName: ErrorName, message: string) {
          const objectContextError = {
               category: ObjectErrorType.VALUE_OBJECT,
               detail: valueObject,
          }
          this.errorLogs.push(new CustomError(objectContextError, errorName, message));
     }

     public getErrors(): string[] {
          return this.errorLogs.map((error) => error.getFormattedError());
     }

}
