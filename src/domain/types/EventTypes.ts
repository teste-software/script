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

export enum TYPES_CALL_EVENTS {
    DISCAGEM = 'DISCAGEM',
    ATENDIMENTO = 'ATENDIMENTO',
    FIMATENDIMENTO = 'FIMATENDIMENTO',
}
