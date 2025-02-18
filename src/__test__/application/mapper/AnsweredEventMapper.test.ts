import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EventMapper - ATTENDANCE", () => {
    test("Deve processar um evento ATTENDANCE corretamente tipo ATIVO", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739562915.1739",
            "event": "ATENDIMENTO",
            "queue_id": "1000-ativo",
            "queue_name": "1000-ativo",
            "number": "+5511960643722",
            "sequence_id": "2",
            "last_sequence": "false",
            "parameter0": "1000jf",
            "parameter1": "9",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/1000jf-000003e1",
            "parameter8": "SIP/55PBXGW01HOMOLOGA-000003e2",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739562915.1739,
            "sequence_id_num": 2,
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: 'ATENDIMENTO',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ativo',
            queueName: '1000-ativo',
            callId: "1739562915.1739",
            centralId: "1000",
            lastSequence: false,
            sequenceId: 2,
            callCenter: true,
            call: {
                type: 'active',
                waitingTime: 9,
                uraTime: 0,
                sourcePhone: '',
                destinationPhone: '+5511960643722'
            },
            branchesNumber: {destination: '', source: '1000jf'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento ATTENDANCE corretamente tipo INTERNAL", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739472737.906",
            "event": "ATENDIMENTO",
            "queue_id": "1000-ramal",
            "queue_name": "1000-ramal",
            "number": "10005s",
            "sequence_id": "2",
            "last_sequence": "false",
            "parameter0": "10008o",
            "parameter1": "2",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "SIP/10005s-00000240",
            "parameter8": "SIP/10008o-00000241",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739472737.906,
            "sequence_id_num": 2,
        }


        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);
        expect(event).toEqual({
            event: 'ATENDIMENTO',
            sequenceId: 2,
            lastSequence: false,
            callId: '1739472737.906',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ramal',
            queueName: '1000-ramal',
            callCenter: true,
            call: {
                type: 'internal',
                waitingTime: 2,
                uraTime: 0,
                sourcePhone: '',
                destinationPhone: ''
            },
            branchesNumber: {destination: '10008o', source: '10005s'}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento ATTENDANCE corretamente tipo Receptivo (ligaçao interna - transferência)", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739381070.115",
            "event": "ATENDIMENTO",
            "queue_id": "1000-ramal",
            "queue_name": "1000-ramal",
            "number": "+5511988651701",
            "sequence_id": "3",
            "last_sequence": "false",
            "parameter0": "1000br",
            "parameter1": "5",
            "parameter2": "",
            "parameter3": "",
            "parameter4": "",
            "parameter5": "",
            "parameter6": "",
            "parameter7": "Local/1516@webphone-1000-0000001a;2",
            "parameter8": "SIP/1000br-0000003e",
            "parameter9": "",
            "carrier": "",
            "call_id_num": 1739381070.115,
            "sequence_id_num": 3,
        }

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: 'ATENDIMENTO',
            sequenceId: 3,
            lastSequence: false,
            callId: '1739381070.115',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '1000-ramal',
            queueName: '1000-ramal',
            callCenter: true,
            call: {
                type: 'receptive',
                waitingTime: 5,
                uraTime: 0,
                sourcePhone: '+5511988651701',
                destinationPhone: ''
            },
            branchesNumber: {destination: '1000br', source: ''}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar um evento ATTENDANCE corretamente tipo Receptivo", () => {
        const rawEvent = {
            "regenerated": false,
            "client_id": "57c87866d0e08d6c73628d8b",
            "central_id": "1000",
            "call_id": "1739562570.1733",
            "event": "ATENDIMENTO",
            "queue_id": "67af93a8bc1c903cc7995ad9",
            "queue_name": "1000-FILA_FEVEREIRO_154",
            "number": "5511960643722",
            "sequence_id": "5",
            "last_sequence": "false",
            "parameter0": "1000jf",
            "parameter1": "2",
            "parameter2": "22",
            "parameter3": "discador",
            "parameter4": "2238",
            "parameter5": "222",
            "parameter6": "Opcao - a",
            "parameter7": "Local/5511960643722@discador-00000173;1",
            "parameter8": "SIP/1000jf-000003e0",
            "parameter9": "DATA9[{field_name:form_id,field_value:5bdaf1989e58462fc0def10b},{field_name:campanha,field_value:M3},{field_name:FAMILIA,field_value:TESTE},{field_name:PRODUTO,field_value:55TESTE},{field_name:DT_EMISSAO,field_value:11/02/2018},{field_name:SEGMENTO,field_value:PBX},{field_name:APOLICE,field_value:114157},{field_name:CERTIFICADO,field_value:55PBX},{field_name:EMAIL,field_value:email@gmail.com},{field_name:grupo,field_value:grupo4}]",
            "carrier": "field_value:5bdaf1989e58462fc0def10b}",
            "call_id_num": 1739562570.1733,
            "sequence_id_num": 5,
            "__v": 0
        }

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: 'ATENDIMENTO',
            sequenceId: 5,
            lastSequence: false,
            callId: '1739562570.1733',
            centralId: '1000',
            clientId: '57c87866d0e08d6c73628d8b',
            queueId: '67af93a8bc1c903cc7995ad9',
            queueName: '1000-FILA_FEVEREIRO_154',
            callCenter: true,
            call: {
                type: 'receptive',
                waitingTime: 2,
                uraTime: 22,
                sourcePhone: '5511960643722',
                destinationPhone: ''
            },
            branchesNumber: {destination: '1000jf', source: ''}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve capturar erro quando um evento desconhecido for passado", () => {
        const rawEvent = {
            event: "UNKNOWN_EVENT",
            client_id: "57c87866d0e08d6c73628d8b",
            queue_id: "1000",
        };

        expect(() => EventMapper.toDomain(rawEvent as unknown as EventRaw)).toThrow("Evento desconhecido: UNKNOWN_EVENT");
    });
});
