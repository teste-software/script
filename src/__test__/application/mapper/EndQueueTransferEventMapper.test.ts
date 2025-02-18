import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EndQueueTransferEventMapper - FIMFILATRANSFERENCIA", () => {

    test("Deve processar corretamente um evento de transferência finalizada na fila", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMFILATRANSFERENCIA",
            queue_id: "1020-ramal",
            queue_name: "1020-ramal",
            number: "102004",
            sequence_id: "5",
            last_sequence: "false",
            parameter1: "45", // Attendance Time
            parameter2: "30"  // Waiting Time
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "FIMFILATRANSFERENCIA",
            sequenceId: 5,
            lastSequence: false,
            callId: "1739816796.9272",
            centralId: "1020",
            clientId: "67adf268acf8f902a5d7a8e7",
            queueId: "1020-ramal",
            queueName: "1020-ramal",
            callCenter: true,
            regenerated: false,
            call: {
                type: "internal",
                waitingTime: 30,
                attendanceTime: 45
            },
            branchesNumber: {destination: "102004"}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar corretamente um evento sem 'branchesNumber.destination'", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "66c4c16ef4a9e776dbe4b357",
            central_id: "1018",
            call_id: "1739392157.311",
            time: "2025-02-12T20:29:17Z",
            event: "FIMFILATRANSFERENCIA",
            queue_id: "1018-ativo",
            queue_name: "1018-ativo",
            number: "",
            sequence_id: "1",
            last_sequence: "false",
            parameter1: "60",
            parameter2: "15"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);


        expect(event).toEqual({
            event: "FIMFILATRANSFERENCIA",
            sequenceId: 1,
            lastSequence: false,
            callId: "1739392157.311",
            centralId: "1018",
            clientId: "66c4c16ef4a9e776dbe4b357",
            queueId: "1018-ativo",
            queueName: "1018-ativo",
            callCenter: true,
            regenerated: false,
            call: {
                type: "active",
                waitingTime: 15,
                attendanceTime: 60
            },
            branchesNumber: {destination: ""}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve retornar erro quando 'waitingTime' for inválido", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739821276.317",
            time: "2025-02-17T19:41:16Z",
            event: "FIMFILATRANSFERENCIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000jf",
            sequence_id: "1",
            last_sequence: "false",
            parameter1: "45",
            parameter2: "invalid" // Erro esperado
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);


        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "call.waitingTime",
            message: "Campo 'call.waitingTime' inválido ou ausente."
        });

        expect(event.call.waitingTime).toBeNaN();
    });

    test("Deve retornar erro quando 'attendanceTime' for negativo", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "FIMFILATRANSFERENCIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000an",
            sequence_id: "1",
            last_sequence: "false",
            parameter1: "-5", // Erro: Tempo de atendimento negativo
            parameter2: "10"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);


        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "call.attendanceTime",
            message: "Campo 'call.attendanceTime' inválido ou ausente."
        });

        expect(event.call.attendanceTime).toEqual(-5);
    });

    test("Deve retornar erro quando 'branchesNumber.destination' não tem 6 dígitos", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "FIMFILATRANSFERENCIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "123", // Número com menos de 6 dígitos
            sequence_id: "1",
            last_sequence: "false",
            parameter1: "45",
            parameter2: "15"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "FIMFILATRANSFERENCIA",
            sequenceId: 1,
            lastSequence: false,
            callId: "1739824259.353",
            centralId: "1000",
            clientId: "57c87866d0e08d6c73628d8b",
            queueId: "1000-ativo",
            queueName: "1000-ativo",
            callCenter: true,
            regenerated: false,
            call: {
                type: "active",
                waitingTime: 15,
                attendanceTime: 45
            },
            branchesNumber: {destination: ""}
        });

        expect(errors).toHaveLength(0);
    });

});
