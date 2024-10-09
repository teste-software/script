import { injectable } from "inversify";

@injectable()
export class CallEventRepository {
    async fetchEvents(callId: string): Promise<any[]> {
      // Simula a busca de eventos no banco
      return [
        {
          id: "123",
          event_type: "DISCAGEM",
          sequence: 1,
          params: {
            caller_number: "5511993602212",
            wait_time: 9
          }
        },
        {
          id: "124",
          event_type: "ATENDIMENTO",
          sequence: 2,
          params: {
            agent_id: "18362k",
            wait_time: 5
          }
        },
        {
          id: "125",
          event_type: "FIMATENDIMENTO",
          sequence: 3,
          params: {
            agent_id: "18362k"
          }
        }
      ];
    }
  }
  