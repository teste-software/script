export interface Event {
    id: string,
    client_id: string,
    central_id: string
    call_id: string,
    time: string,
    event: string,
    queue_id: string,
    queue_name: string,
    originator: string,
    sequence_id: string,
    last_sequence: string,
    data: string,
    data1: string,
    data2: string,
    data3: string,
    data4: string,
    data5: string,
    data6: string,
    data7: string,
    data8: string,
    data9: string,
}

export enum BRANCHES_TYPE_EVENTS_NAMES {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    PAUSE = 'PAUSA',
    RESUME_PAUSE = 'SAIUPAUSA',
    SCHEDULED_PAUSE = 'PAUSAAGENDADA',
    CANCELED_PAUSE = 'PAUSACANCELADA',
    STATUS = 'STATUS',
}

export enum CALLS_TYPE_EVENTS_NAMES {
    ATTENDANCE = 'ATENDIMENTO',
    BLOCKAGE = 'BLOQUEIO',
    CALL_AGENT = 'CHAMAAGENTE',
    DIALING = 'DISCAGEM',
    ENTER_QUEUE = 'ENTRAFILA',
    ENTER_IVR = 'ENTRAURA',
    END_ATTENDANCE = 'FIMATENDIMENTO',
    END_CALL = 'FIMCHAMADA',
    END_MONITORING = 'FIMMONITORIA',
    END_IVR = 'FIMURA',
    END_QUEUE_TRANSFER = 'FIMFILATRANSFERENCIA',
    END_IVR_TRANSFER = 'FIMURATRANSFERENCIA',
    FINALIZATION = 'FINALIZACAO',
    MONITORING = 'MONITORIA',
    REFUSAL = 'RECUSA',
    RETURN_IVR = 'RETORNOURA',
    OVERFLOW = 'TRANSBORDO',
    TRANSFER = 'TRANSFERENCIA',
    QUEUE_TRANSFER = 'TRANSFERENCIAFILA',
    IVR_TRANSFER = 'TRANSFERENCIAURA',
    CALLBACK = 'CALLBACK'
}
