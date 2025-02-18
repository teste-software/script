import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("MonitoringEventMapper - MONITORIA", () => {

    test("Deve processar corretamente um evento de monitoria", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "MONITORIA",
            queue_id: "1020-ramal",
            queue_name: "1020-ramal",
            number: "102004",
            sequence_id: "5",
            last_sequence: "true",
            parameter2: "1739816796.5555" // callIdMonitoring
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "MONITORIA",
            sequenceId: 5,
            lastSequence: true,
            callId: "1739816796.9272",
            centralId: "1020",
            clientId: "67adf268acf8f902a5d7a8e7",
            queueId: "1020-ramal",
            queueName: "1020-ramal",
            callCenter: true,
            call: {
                type: "internal",
                callIdMonitoring: "1739816796.5555"
            },
            branchesNumber: {source: "102004"}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve retornar erro quando 'callIdMonitoring' for inválido", () => {
        const rawEvent = {
            client_id: "66c4c16ef4a9e776dbe4b357",
            central_id: "1018",
            call_id: "1739392157.311",
            time: "2025-02-12T20:29:17Z",
            event: "MONITORIA",
            queue_id: "1018-ativo",
            queue_name: "1018-ativo",
            number: "101801",
            sequence_id: "1",
            last_sequence: "true",
            parameter2: "" // callIdMonitoring ausente
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "call.callIdMonitoring",
            message: "Campo 'call.callIdMonitoring' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'branchesNumber.source' não tem 6 dígitos", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739821276.317",
            time: "2025-02-17T19:41:16Z",
            event: "MONITORIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "123", // Número inválido
            sequence_id: "1",
            last_sequence: "true",
            parameter2: "1739821276.9999"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "branchesNumber.source",
            message: "Campo 'branchesNumber.source' inválido ou ausente."
        });

        expect(event.branchesNumber.source).toBe("123");
    });

    test("Deve retornar erro quando 'sequenceId' for negativo", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "MONITORIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000an",
            sequence_id: "-5",
            last_sequence: "true",
            parameter2: "1739824259.7777"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "sequenceId",
            message: "Campo 'sequenceId' inválido ou ausente."
        });

        expect(event.sequenceId).toBe(-5);
    });

    test("Deve retornar erro quando 'lastSequence' estiver ausente", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "MONITORIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000an",
            sequence_id: "1",
            parameter2: "1739824259.7777"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "MONITORIA",
            sequenceId: 1,
            lastSequence: false,
            callId: "1739824259.353",
            centralId: "1000",
            clientId: "57c87866d0e08d6c73628d8b",
            queueId: "1000-ativo",
            queueName: "1000-ativo",
            callCenter: true,
            call: {
                type: "active",
                callIdMonitoring: "1739824259.7777"
            },
            branchesNumber: {source: "1000an"}
        });

        expect(errors).toHaveLength(0);
    });
})
