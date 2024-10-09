export interface EventDTO {
    id: string;
    event_type: string;
    sequence: number;
    params: {
      caller_number?: string;
      wait_time?: number;
      agent_id?: string;
    };
  }
