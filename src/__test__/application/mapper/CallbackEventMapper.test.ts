import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EventMapper - CALLBACK", () => {
    test("Deve processar um evento CALLBACK corretamente (v1)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1730980811.718",
            "event": "CALLBACK",
            "queue_id": "",
            "queue_name": "",
            "number": "1000bc",
            "sequence_id": "3",
            "last_sequence": "false",
            "parameter0": "6553f83468ed3e4ef179766a",
            "parameter1": "6553f83468ed3e4ef179766b",
            "parameter2": "650b1c5ed441b5561bb8d51d",
            "parameter3": "0",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1730980811.718,
            "sequence_id_num": 3,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        expect(event).toEqual({
                event: 'CALLBACK',
                sequenceId: 3,
                lastSequence: false,
                callId: '1730980811.718',
                centralId: '1000',
                clientId: '57c87866d0e08d6c73628d8b',
                queueId: '',
                queueName: '',
                callCenter: true,
                call: {type: 'receptive'},
                branchesNumber: {}
            }
        );

        const expectedErrors = [
            {field: 'queueId', message: "Campo 'queueId' inválido ou ausente."},
            {field: 'queueName', message: "Campo 'queueName' inválido ou ausente."}
        ];
        expect(errors).toEqual(expectedErrors);
    });

    test("Deve processar um evento CALLBACK corretamente (v2)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1729622589.892",
            "event": "CALLBACK",
            "queue_id": "663a692c7e058a3505c5fa7c",
            "queue_name": "FILA_CALLBACK_1522",
            "number": "100021",
            "sequence_id": "6",
            "last_sequence": "false",
            "parameter0": "",
            "parameter1": "",
            "parameter2": "",
            "parameter3": "1342",
            "parameter4": "1000-FILA_TRANSBORDO_1522",
            "parameter5": "663a695f7e058a3505c5fa88",
            "parameter6": "",
            "parameter7": "",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1729622589.892,
            "sequence_id_num": 6,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
                event: 'CALLBACK',
                sequenceId: 6,
                lastSequence: false,
                callId: '1729622589.892',
                centralId: '1000',
                clientId: '57c87866d0e08d6c73628d8b',
                queueId: '663a692c7e058a3505c5fa7c',
                queueName: 'FILA_CALLBACK_1522',
                callCenter: true,
                call: {type: 'receptive'},
                branchesNumber: {}
            }
        );

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento CALLBACK corretamente (v3)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1723589191.1463",
            "event": "CALLBACK",
            "queue_id": "668449f5ca658776509e81fb",
            "queue_name": "MUNIZ_CALLBACK_H1",
            "number": "5511987438287",
            "sequence_id": "6",
            "last_sequence": "false",
            "parameter0": "194",
            "parameter1": "808",
            "parameter2": "",
            "parameter3": "551148732174",
            "parameter4": "",
            "parameter5": "0",
            "parameter6": "",
            "parameter7": "SIP/55PBXGW01HOMOLOGA-00000389",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1723589191.1463,
            "sequence_id_num": 6,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: 'CALLBACK',
            sequenceId: 6,
            lastSequence: false,
            callId: '1723589191.1463',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '668449f5ca658776509e81fb',
            queueName: 'MUNIZ_CALLBACK_H1',
            callCenter: true,
            call: {type: 'receptive'},
            branchesNumber: {}
        });

        expect(errors).toHaveLength(0);
    });

});
