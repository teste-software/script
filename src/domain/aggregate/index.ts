import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES, Event} from '../types/EventTypes'
import {CustomError, ErrorName, ObjectErrorType, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";


export class BaseAggregate {
    protected errorLogs: CustomError[] = [];

    protected logError(valueObject: ValueObjectErrorDetail,errorName: ErrorName, message: string, eventType?: CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES) {
        const objectContextError = {
            category: ObjectErrorType.AGGREGATE,
            detail: valueObject,
            eventType: eventType
        }
        this.errorLogs.push(new CustomError(objectContextError, errorName, message));
    }

    public getErrors(): string[] {
        return this.errorLogs.map((error) => error.getFormattedError());
    }
}
