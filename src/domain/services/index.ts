import {BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES, Event} from '../types/EventTypes'
import {CustomError, ErrorName, ObjectErrorType, ValueObjectErrorDetail} from "../../infrastructure/errors/CustomError";

export class BaseService {
    protected errorLogs: CustomError[] = [];

    protected logError(
        valueObject: ValueObjectErrorDetail,
        errorName: ErrorName,
        message: string,
        eventType?: CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES,
        callId?: string
    ) {
        const objectContextError = {
            category: ObjectErrorType.DOMAIN_SERVICE,
            detail: valueObject,
            eventType: eventType
        }
        this.errorLogs.push(new CustomError(objectContextError, errorName, message, callId));
    }

    public getErrors(): string[] {
        return this.errorLogs.map((error) => error.getFormattedError());
    }
}
