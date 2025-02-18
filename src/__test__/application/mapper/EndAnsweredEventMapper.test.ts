import { EventMapper } from "../../../application/mappers/EventMapper";
import { EventRaw } from "../../../application/dtos/events";

describe("EndAnsweredEventMapper - FIM_ATENDIMENTO", () => {

    test("Deve processar corretamente um evento de atendimento finalizado (receptivo)", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "67adf268acf8f902a5d7a8e7",
            central_id: "1020",
            call_id: "1739816796.9272",
            time: "2025-02-17T18:26:37Z",
            event: "FIMATENDIMENTO",
            queue_id: "1020-ramal",
            queue_name: "1020-ramal",
            number: "+5511955806526",
            sequence_id: "5",
            last_sequence: "false",
            parameter0: "102004",
            parameter1: "",
            parameter2: "30", // Waiting Time
            parameter3: "90", // Attendance Time
            parameter9: "1021",
            call_id_num: 1739816796.9272,
            sequence_id_num: 5
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(event).toEqual({
            event: "FIMATENDIMENTO",
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
                attendanceTime: 90,
                sourcePhone: "",
                destinationPhone: ""
            },
            branchesNumber: { destination: "1021", source: "+5511955806526" }
        });

        expect(errors).toHaveLength(2);
        expect(errors).toContainEqual({
            field: "branchesNumber.source",
            message: "Campo 'branchesNumber.source' inválido ou ausente."
        });
    });

    test("Deve retornar erro quando 'waitingTime' for inválido", () => {
        const rawEvent = {
            regenerated: false,
            client_id: "57c87866d0e08d6c73628d8b",
            central_id: "1000",
            call_id: "1739821276.317",
            time: "2025-02-17T19:41:16Z",
            event: "FIMATENDIMENTO",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000jf",
            sequence_id: "1",
            last_sequence: "false",
            parameter2: "invalid", // Erro esperado
            parameter3: "45",
            parameter9: "1000jf"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(2);
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
            event: "FIMATENDIMENTO",
            queue_id: "1000-ativo",
            queue_name: "1000-ativo",
            number: "1000an",
            sequence_id: "1",
            last_sequence: "false",
            parameter2: "10",
            parameter3: "-5", // Erro: Tempo de atendimento não pode ser negativo
            parameter9: "4565"
        };

        const event = EventMapper.toDomain(rawEvent as unknown as EventRaw);
        const errors = EventMapper.validate(event);

        expect(errors).toHaveLength(3);
        expect(errors).toContainEqual({
            field: "call.attendanceTime",
            message: "Campo 'call.attendanceTime' inválido ou ausente."
        });

        expect(event.call.attendanceTime).toEqual(-5);
    });

});
