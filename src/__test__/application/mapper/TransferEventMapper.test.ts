import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("TransferEventMapper - TRANSFERENCIA", () => {

    test("Deve processar corretamente um evento de transferência", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "TRANSFERENCIA",
            queue_id: "1020-ativo",
            queue_name: "1020-ativo",
            sequence_id: "5",
            last_sequence: "true",
            parameter1: "+5511960643722", // sourcePhone
            parameter2: "1739816796.5555", // transferCallId
            parameter3: "30", // uraTime
            parameter4: "15", // waitingTime
            parameter7: "1025-ramal", // transferQueueId
            number: "123456" // destination (OBRIGATÓRIO)
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "TRANSFERENCIA",
            sequenceId: 5,
            lastSequence: true,
            callId: "1739816796.9272",
            centralId: "1020",
            clientId: "67adf268acf8f902a5d7a8e7",
            queueId: "1020-ativo",
            queueName: "1020-ativo",
            callCenter: true,
            call: {
                type: "active",
                waitingTime: 15,
                uraTime: 0,
                sourcePhone: "+5511960643722",
                transferCallId: "1739816796.5555",
                transferQueueId: "1025-ramal"
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
            event: "TRANSFERENCIA",
            queue_id: "1018-ativo",
            queue_name: "1018-ativo",
            sequence_id: "1",
            last_sequence: "true",
            parameter1: "+5511960643722",
            parameter2: "1739816796.5555",
            parameter3: "30",
            parameter4: "15",
            parameter7: "1025-ramal"
            // NÃO POSSUI 'number' (destination)
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toContainEqual({
            field: "branchesNumber.destination",
            message: "Campo 'branchesNumber.destination' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'sourcePhone' for inválido", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "TRANSFERENCIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            sequence_id: "1",
            last_sequence: "true",
            parameter1: "123", // Número inválido
            parameter2: "1739821276.5555",
            parameter3: "30",
            parameter4: "15",
            parameter7: "1025-ramal",
            number: "654321"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toContainEqual({
            field: "call.sourcePhone",
            message: "Campo 'call.sourcePhone' inválido ou ausente."
        });

        expect(event.call.sourcePhone).toBe("123");
    });

    test("Deve retornar erro quando 'sequenceId' for negativo", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "TRANSFERENCIA",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            sequence_id: "-5",
            last_sequence: "true",
            parameter1: "+5511960643722",
            parameter2: "1739821276.5555",
            parameter3: "30",
            parameter4: "15",
            parameter7: "1025-ramal",
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
