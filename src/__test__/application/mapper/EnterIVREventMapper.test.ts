import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EnterIVREventMapper - ENTRAURA", () => {

    test("Deve processar corretamente um evento de entrada na fila (forceCreated=false)", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "ENTRAURA",
            queue_id: "",
            queue_name: "",
            number: "102004",
            sequence_id: "5",
            last_sequence: "false",
            parameter5: "false"  // forceCreated = false
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "ENTRAURA",
            sequenceId: 5,
            lastSequence: false,
            callId: "1739816796.9272",
            centralId: "1020",
            clientId: "67adf268acf8f902a5d7a8e7",
            queueId: "",
            queueName: "",
            callCenter: true,
            call: {
                type: undefined,
                inputTime: new Date("2025-02-17T18:26:37Z"),
                forceCreated: false
            },
            branchesNumber: { source: "" }
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve processar corretamente um evento de entrada na fila (forceCreated=true)", () => {
        const rawEvent = {
            client_id: "66c4c16ef4a9e776dbe4b357",
            central_id: "1018",
            call_id: "1739392157.311",
            time: "2025-02-12T20:29:17Z",
            event: "ENTRAURA",
            queue_id: "",
            queue_name: "",
            number: "101801",
            sequence_id: "1",
            last_sequence: "false",
            parameter5: "true"  // forceCreated = true
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "ENTRAURA",
            sequenceId: 1,
            lastSequence: false,
            callId: "1739392157.311",
            centralId: "1018",
            clientId: "66c4c16ef4a9e776dbe4b357",
            queueId: "1018-ramal",
            queueName: "1018-ramal",
            callCenter: true,
            call: {
                type: "internal",
                inputTime: new Date("2025-02-12T20:29:17Z"),
                forceCreated: true
            },
            branchesNumber: { source: "101801" }
        });

        expect(errors).toHaveLength(0);
    });

    test("Deve retornar erro quando 'inputTime' for inválido", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739821276.317",
            time: "invalid-date",  // Erro esperado
            event: "ENTRAURA",
            queue_id: "",
            queue_name: "",
            number: "1000jf",
            sequence_id: "1",
            last_sequence: "false",
            parameter5: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "call.inputTime",
            message: "Campo 'call.inputTime' inválido ou ausente."
        });

        expect(event.call.inputTime).toBeInstanceOf(Date);
        // @ts-ignore
        expect(isNaN(event.call?.inputTime?.getTime())).toBe(true);
    });

    test("Deve retornar erro quando 'branchesNumber.source' não tem 6 dígitos e 'forceCreated=true'", () => {
        const rawEvent = {
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739824259.353",
            time: "2025-02-17T20:31:00Z",
            event: "ENTRAURA",
            queue_id: "",
            queue_name: "",
            number: "123",  // Número com menos de 6 dígitos
            sequence_id: "1",
            last_sequence: "false",
            parameter5: "true"
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

});
