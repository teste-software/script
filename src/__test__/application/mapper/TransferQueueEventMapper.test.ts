import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("TransferQueueEventMapper - TRANSFERENCIAFILA", () => {

    test("Deve processar corretamente um evento de transferência de fila", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "TRANSFERENCIAFILA",
            queue_id: "1020-ramal",
            queue_name: "1020-ramal",
            sequence_id: "5",
            last_sequence: "true",
            parameter2: "1739816796.5555", // transferCallId
            number: "123456" // destination
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "TRANSFERENCIAFILA",
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
                inputTime: new Date("2025-02-17T18:26:37.000Z"),
                transferCallId: "1739816796.5555",
            },
            branchesNumber: { destination: "123456" }
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve retornar erro quando 'branchesNumber.destination' estiver ausente", () => {
        const rawEvent = {
            client_id: "66c4c16ef4a9e776dbe4b357",
            central_id: "1018",
            call_id: "1739392157.311",
            time: "2025-02-12T20:29:17Z",
            event: "TRANSFERENCIAFILA",
            queue_id: "1018-ativo",
            queue_name: "1018-ativo",
            sequence_id: "1",
            last_sequence: "true",
            parameter2: "1739816796.5555"
            // NÃO POSSUI 'number' (destination)
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toContainEqual({
            field: "branchesNumber.destination",
            message: "Campo 'branchesNumber.destination' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'transferCallId' estiver ausente", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739821276.317",
            time: "2025-02-17T19:41:16Z",
            event: "TRANSFERENCIAFILA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            sequence_id: "1",
            last_sequence: "true",
            number: "654321"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toContainEqual({
            field: "call.transferCallId",
            message: "Campo 'call.transferCallId' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'sequenceId' for negativo", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "TRANSFERENCIAFILA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            sequence_id: "-5",
            last_sequence: "true",
            parameter2: "1739821276.5555",
            number: "987654"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toContainEqual({
            field: "sequenceId",
            message: "Campo 'sequenceId' inválido ou ausente."
        });

        expect(event.sequenceId).toBe(-5);
    });


});
