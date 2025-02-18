import { BRANCHES_TYPE_EVENTS_NAMES, CALLS_TYPE_EVENTS_NAMES } from "../../domain/types/EventTypes";

export enum ObjectErrorType {
    ENTITY = 'Entidade',
    VALUE_OBJECT = 'Objeto de Valor',
    DOMAIN_SERVICE = 'Serviço de Domínio',
    FACTORY = 'Fábrica',
    AGGREGATE = 'Agregado'
}

export enum ValueObjectErrorDetail {
    QUEUE = 'Fila',
    BRANCH = 'Ramal',
    CALL = 'Ligação',
    EVENT = 'Evento',
    BRANCH_ATTENDANCE_TIME = 'Tempo de Atendimento do Ramal',
    BRANCH_NUMBER = 'Número do Ramal',
    CALL_ATTENDANCE_TIME = 'Tempo de Atendimento da Chamada',
    CALL_INPUT_TIME = 'Tempo de Entrada da Chamada',
    CALL_URA_TIME = 'Tempo de URA da Chamada',
    CALL_WAITING_TIME = 'Tempo de Espera da Chamada',
    CLIENT_ID = 'ID do Cliente',
    PHONE_NUMBER = 'Número de Telefone',
    QUEUE_ID = 'ID da Fila',
    QUEUE_NAME = 'Nome da Fila',
    CALL_STATE='Estado da ligação',
    BRANCH_STATE='Estado do ramal',
    CALL_ID_MONITORING='Call Id Ligação Monitorada'
}

export enum ErrorName {
    INVALID_DATA = 'Dado Inválido',
    INVALID_SEQUENCE_ID = 'Sequencia ID inválido',
    INVALID_EVENT = 'Inválido evento',
    DATA_NOT_FOUND = 'Dado Não Existe',
    INVALID_TRANSITION = 'Transição inválido'
}

interface ObjectErrorContext {
    category: ObjectErrorType;
    detail: ValueObjectErrorDetail;
    eventType?: CALLS_TYPE_EVENTS_NAMES | BRANCHES_TYPE_EVENTS_NAMES;
}

export class CustomError extends Error {
    public readonly objectContext: ObjectErrorContext;
    public readonly callId: string;
    public readonly errorName: ErrorName;

    constructor(objectContext: ObjectErrorContext, errorName: ErrorName, message: string, callId: string = '') {
        super(message);
        this.objectContext = objectContext;
        this.callId = callId;
        this.errorName = errorName;

        this.name = `${objectContext.category}-${errorName}`;
        console.log(this.getFormattedError())
    }

    public getFormattedError(): string {
        return `[${this.objectContext.category}.${this.objectContext.detail}${this.objectContext.eventType ? `.${this.objectContext.eventType}` : ''}] - Call ID: ${this.callId} - Error: ${this.errorName} - Message: ${this.message}`;
    }
}
