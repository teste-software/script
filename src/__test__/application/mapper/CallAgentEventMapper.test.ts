import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EventMapper - CHAMAAGENTE", () => {
    test("Deve processar um evento CHAMAAGENTE corretamente (v1)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "67adf268acf8f902a5d7a8e7",
            "central_id": "1020",
            "call_id": "1739814990.204",
            "event": "CHAMAAGENTE",
            "queue_id": "67adf95195deb44fab6a938c",
            "queue_name": "1020-FILA_HARA",
            "number": "+5511955806526",
            "sequence_id": "6",
            "last_sequence": "false",
            "parameter0": "1020-FILA_HARA",
            "parameter1": "67adf95195deb44fab6a938c",
            "parameter2": "102003",
            "parameter3": "ativo",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "Local/102003@agents-00000039;2",
            "parameter8": "false",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739814990.204,
            "sequence_id_num": 6,
            "call_finished_reason": "attended"
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event)

        expect(event).toEqual({
            event: 'CHAMAAGENTE',
            sequenceId: 6,
            lastSequence: false,
            callId: '1739814990.204',
            centralId: '1020',
            clientId: '67adf268acf8f902a5d7a8e7',
            queueId: '67adf95195deb44fab6a938c',
            queueName: '1020-FILA_HARA',
            callCenter: true,
            call: {type: 'receptive'},
            branchesNumber: {destination: '102003'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento CHAMAAGENTE corretamente (v2)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "67adf268acf8f902a5d7a8e7",
            "central_id": "1020",
            "call_id": "1739814810.175",
            "event": "CHAMAAGENTE",
            "queue_id": "67adf95195deb44fab6a938c",
            "queue_name": "1020-FILA_HARA",
            "number": "+5511955806526",
            "sequence_id": "6",
            "last_sequence": "false",
            "parameter0": "1020-FILA_HARA",
            "parameter1": "67adf95195deb44fab6a938c",
            "parameter2": "102003",
            "parameter3": "ativo",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "Local/102003@agents-00000030;2",
            "parameter8": "false",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739814810.175,
            "sequence_id_num": 6,
            "__v": 0,
            "call_finished_reason": "attended"
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event)

        expect(event).toEqual({
            event: 'CHAMAAGENTE',
            sequenceId: 6,
            lastSequence: false,
            callId: '1739814810.175',
            centralId: '1020',
            clientId: '67adf268acf8f902a5d7a8e7',
            queueId: '67adf95195deb44fab6a938c',
            queueName: '1020-FILA_HARA',
            callCenter: true,
            call: {type: 'receptive'},
            branchesNumber: {destination: '102003'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento CHAMAAGENTE corretamente (v3)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "67adf268acf8f902a5d7a8e7",
            "central_id": "1020",
            "call_id": "1739814702.160",
            "event": "CHAMAAGENTE",
            "queue_id": "67adf95195deb44fab6a938c",
            "queue_name": "1020-FILA_HARA",
            "number": "+5511955806526",
            "sequence_id": "6",
            "last_sequence": "false",
            "parameter0": "1020-FILA_HARA",
            "parameter1": "67adf95195deb44fab6a938c",
            "parameter2": "102003",
            "parameter3": "ativo",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "Local/102003@agents-0000002b;2",
            "parameter8": "false",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739814702.16,
            "sequence_id_num": 6,
            "__v": 0,
            "call_finished_reason": "timeout"
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event)

        expect(event).toEqual({
            event: 'CHAMAAGENTE',
            sequenceId: 6,
            lastSequence: false,
            callId: '1739814702.160',
            centralId: '1020',
            clientId: '67adf268acf8f902a5d7a8e7',
            queueId: '67adf95195deb44fab6a938c',
            queueName: '1020-FILA_HARA',
            callCenter: true,
            call: {type: 'receptive'},
            branchesNumber: {destination: '102003'}
        });

        expect(errors).toHaveLength(0);
    });

});
