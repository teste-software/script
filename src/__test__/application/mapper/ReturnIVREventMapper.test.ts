import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("ReturnIVREventMapper - RETORNOURA", () => {

    test("Deve processar corretamente um evento de retorno à URA", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "RETORNOURA",
            sequence_id: "5",
            last_sequence: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "RETORNOURA",
            sequenceId: 5,
            lastSequence: true,
            callId: "1739816796.9272",
            centralId: "1020",
            clientId: "67adf268acf8f902a5d7a8e7",
            queueId: "",
            queueName: "",
            callCenter: true,
            call: {},
            branchesNumber: {}
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve retornar erro quando 'clientId' estiver ausente", () => {
        const rawEvent = {
            central_id: "1018",
            call_id: "1739392157.311",
            time: "2025-02-12T20:29:17Z",
            event: "RETORNOURA",
            sequence_id: "1",
            last_sequence: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "clientId",
            message: "Campo 'clientId' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'callId' estiver ausente", () => {
        const rawEvent = {
            client_id: "66c4c16ef4a9e776dbe4b357",
            central_id: "1018",
            time: "2025-02-12T20:29:17Z",
            event: "RETORNOURA",
            sequence_id: "1",
            last_sequence: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "callId",
            message: "Campo 'callId' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'sequenceId' for negativo", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "RETORNOURA",
            sequence_id: "-5",
            last_sequence: "true"
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
            event: "RETORNOURA",
            sequence_id: "1"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "RETORNOURA",
            sequenceId: 1,
            lastSequence: false,
            callId: "1739824259.353",
            centralId: "1000",
            clientId: "57c87866d0e08d6c73628d8b",
            queueId: "",
            queueName: "",
            callCenter: true,
            call: {},
            branchesNumber: {}
        });

        expect(errors).toHaveLength(0);
    });

});
