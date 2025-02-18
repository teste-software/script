import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EventMapper - DISCAGEM", () => {
    test("Deve processar um evento DISCAGEM corretamente (v1)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "67adf268acf8f902a5d7a8e7",
            "central_id": "1020",
            "call_id": "1739816796.9272",
            "time": "2025-02-17T18:26:37Z",
            "event": "DISCAGEM",
            "queue_id": "1020-ramal",
            "queue_name": "1020-ramal",
            "number": "+5511955806526",
            "sequence_id": "5",
            "last_sequence": "false",
            "parameter0": "102004",
            "parameter1": "",
            "parameter2": "",
            "parameter3": "ativo",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/55PBXGW01HOMOLOGA-00000076",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739816796.9272,
            "sequence_id_num": 5,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event, errors);

        expect(event).toEqual({
                event: 'DISCAGEM',
                sequenceId: 5,
                lastSequence: false,
                callId: '1739816796.9272',
                centralId: '1020',
                clientId: '67adf268acf8f902a5d7a8e7',
                queueId: '1020-ramal',
                queueName: '1020-ramal',
                callCenter: true,
                call: {
                    type: 'receptive',
                    inputTime: new Date('2025-02-17T18:26:37.000Z'),
                    sourcePhone: '+5511955806526',
                    destinationPhone: ''
                },
                branchesNumber: {destination: '102004', source: ''}
            }
        );

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento DISCAGEM corretamente (v2)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "66c4c16ef4a9e776dbe4b357",
            "central_id": "1018",
            "call_id": "1739392157.311",
            "time": "2025-02-12T20:29:17Z",
            "event": "DISCAGEM",
            "queue_id": "1018-ativo",
            "queue_name": "1018-ativo",
            "number": "101801",
            "sequence_id": "1",
            "last_sequence": "false",
            "parameter0": "+5511987438287",
            "parameter1": "",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/101801-000000d5",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739392157.311,
            "sequence_id_num": 1,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event, errors);

        expect(event).toEqual({
                event: 'DISCAGEM',
                sequenceId: 1,
                lastSequence: false,
                callId: '1739392157.311',
                centralId: '1018',
                clientId: '66c4c16ef4a9e776dbe4b357',
                queueId: '1018-ativo',
                queueName: '1018-ativo',
                callCenter: true,
                call: {
                    type: 'active',
                    inputTime: new Date('2025-02-12T20:29:17.000Z'),
                    sourcePhone: '',
                    destinationPhone: '+5511987438287'
                },
                branchesNumber: {destination: '', source: '101801'}
            }
        );

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento DISCAGEM corretamente (v3)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739821276.317",
            "time": "2025-02-17T19:41:16Z",
            "event": "DISCAGEM",
            "queue_id": "1000-ativo",
            "queue_name": "1000-ativo",
            "number": "1000jf",
            "sequence_id": "1",
            "last_sequence": "false",
            "parameter0": "+5511960643722",
            "parameter1": "1148732174",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/1000jf-000000b5",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739821276.317,
            "sequence_id_num": 1,
            "__v": 0,
            "call_finished_reason": "attended"
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: 'DISCAGEM',
            sequenceId: 1,
            lastSequence: false,
            callId: '1739821276.317',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ativo',
            queueName: '1000-ativo',
            callCenter: true,
            call: {
                type: 'active',
                inputTime: new Date('2025-02-17T19:41:16.000Z'),
                sourcePhone: '',
                destinationPhone: '+5511960643722'
            },
            branchesNumber: {destination: '', source: '1000jf'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento DISCAGEM corretamente (v4)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739824259.353",
            "time": "2025-02-17T20:31:00Z",
            "event": "DISCAGEM",
            "queue_id": "1000-ativo",
            "queue_name": "1000-ativo",
            "number": "1000an",
            "sequence_id": "1",
            "last_sequence": "false",
            "parameter0": "4565",
            "parameter1": "1000an",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/1000an-000000c7",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739824259.353,
            "sequence_id_num": 1,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event, errors);

        expect(event).toEqual({
            event: 'DISCAGEM',
            sequenceId: 1,
            lastSequence: false,
            callId: '1739824259.353',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ativo',
            queueName: '1000-ativo',
            callCenter: true,
            call: {
                type: 'internal',
                inputTime: new Date('2025-02-17T20:31:00.000Z'),
                sourcePhone: '',
                destinationPhone: ''
            },
            branchesNumber: {destination: '4565', source: '1000an'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento DISCAGEM corretamente (v5)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "67adf268acf8f902a5d7a8e7",
            "central_id": "1020",
            "call_id": "1739816776.241",
            "event": "DISCAGEM",
            "time": "2025-02-17T18:26:16Z",
            "queue_id": "1020-ativo",
            "queue_name": "1020-ativo",
            "number": "102004",
            "sequence_id": "1",
            "last_sequence": "false",
            "parameter0": "+5511955806526",
            "parameter1": "1133366870",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/102004-00000075",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739816776.241,
            "sequence_id_num": 1,
            "__v": 0,
            "call_finished_reason": "attended"
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event, errors);

        expect(event).toEqual({
            event: 'DISCAGEM',
            sequenceId: 1,
            lastSequence: false,
            callId: '1739816776.241',
            centralId: '1020',
            clientId: '67adf268acf8f902a5d7a8e7',
            queueId: '1020-ativo',
            queueName: '1020-ativo',
            callCenter: true,
            call: {
                type: 'active',
                inputTime: new Date('2025-02-17T18:26:16.000Z'),
                sourcePhone: '',
                destinationPhone: '+5511955806526'
            },
            branchesNumber: {destination: '', source: '102004'}
        });

        expect(errors).toHaveLength(0);
    });
});
