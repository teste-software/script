import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EventMapper - BLOQUEIO", () => {
    test("Deve processar um evento BLOQUEIO corretamente tipo ATIVO", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739570971.1779",
            "event": "BLOQUEIO",
            "queue_id": "1000-ativo",
            "queue_name": "1000-ativo",
            "number": "100004",
            "sequence_id": "2",
            "last_sequence": "false",
            "parameter0": "\"O ramal que esta fazendo a ligacao encontra-se em pausa e nao pode efetuar ou receber chamadas\"",
            "parameter1": "",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739570971.1779,
            "sequence_id_num": 2,
            "__v": 0
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event)

        expect(event).toEqual({
            event: 'BLOQUEIO',
            sequenceId: 2,
            lastSequence: false,
            callId: '1739570971.1779',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ativo',
            queueName: '1000-ativo',
            callCenter: true,
            call: {type: 'active'},
            branchesNumber: {source: '100004'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento BLOQUEIO corretamente tipo INTERNAL", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739559694.1693",
            "event": "BLOQUEIO",
            "queue_id": "1000-ramal",
            "queue_name": "1000-ramal",
            "number": "1000dh",
            "sequence_id": "2",
            "last_sequence": "false",
            "parameter0": "\"O ramal que esta fazendo ou recebendo a ligacao encontra-se em desconectado e nao pode efetuar ou receber chamadas\"",
            "parameter1": "",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "",
            "parameter8": "",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739559694.1693,
            "sequence_id_num": 2,
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        console.log(event)

        expect(event).toEqual({
            event: 'BLOQUEIO',
            sequenceId: 2,
            lastSequence: false,
            callId: '1739559694.1693',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ramal',
            queueName: '1000-ramal',
            callCenter: true,
            call: {type: 'internal'},
            branchesNumber: {source: '1000dh'}
        });

        expect(errors).toHaveLength(0);
    });

});
