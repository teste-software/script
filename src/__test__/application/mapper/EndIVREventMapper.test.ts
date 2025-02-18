import {EventMapper} from "../../../application/mappers/EventMapper";
import {EventRaw} from "../../../application/dtos/events";

describe("EndIVREventMapper - FIMURA", () => {

    test("Deve processar corretamente um evento de finalização de IVR", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMURA",
            sequence_id: "5",
            last_sequence: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "FIMURA",
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

    test("Deve retornar erro quando 'clientId' for inválido", () => {
        const rawEvent = {
            client_id: "",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMURA",
            sequence_id: "5",
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
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            time: "2025-02-17T18:26:37Z",
            event: "FIMURA",
            sequence_id: "5",
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
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMURA",
            sequence_id: "-1",
            last_sequence: "true"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(1);
        expect(errors).toContainEqual({
            field: "sequenceId",
            message: "Campo 'sequenceId' inválido ou ausente."
        });

        expect(event.sequenceId).toBe(-1);
    });

    test("Deve retornar erro quando 'lastSequence' estiver ausente", () => {
        const rawEvent = {
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMURA",
            sequence_id: "5"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
const errors = EventMapper.validate(event);


        expect(event).toEqual({
            event: "FIMURA",
            sequenceId: 5,
            lastSequence: false,
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

});
