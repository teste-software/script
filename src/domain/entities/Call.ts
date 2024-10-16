import {TYPES_CALL_EVENTS} from "../types/EventTypes";

export enum STATES {
    PENDING = 'Pendente',
    IN_URA = 'Em ura',
    IN_QUEUE = 'Em fila',
    CALLING = 'Chamando',
    IN_ATTENDANCE = 'Em atendimento',
    TRANSFERRED = 'Transferida',
    FINISHED = 'Finalizada'
}

type TransitionMap = {
    [event in TYPES_CALL_EVENTS]: {
        [currentState in STATES]?: STATES
    }
}

export default class Call {
    private readonly callId: string;
    constructor(callId: string) {
        this.callId = callId;
    }

    private state: STATES = STATES.PENDING;
    public historiesStates: STATES[] = [ ];

    transitions: TransitionMap = {
        'DISCAGEM': {
            [STATES.PENDING]: STATES.CALLING
        },
        'ATENDIMENTO': {
            [STATES.CALLING]: STATES.IN_ATTENDANCE
        },
        'FIMATENDIMENTO': {
            [STATES.CALLING]: STATES.FINISHED,
            [STATES.IN_ATTENDANCE]: STATES.FINISHED
        }
    }

    fsmStatusTransition(event: TYPES_CALL_EVENTS) {
        const nextState = this.transitions[event][this.state];

        if (nextState) {
            this.historiesStates.push(nextState);
            return this.state = nextState;
        }
        throw new Error('Error: ');
    }

    getState(): STATES {
        return this.state
    }

    getCallId() {
        return this.callId;
    }

    checkIfThereWasStatus(state: STATES) {
        return this.historiesStates.some((historyState) => historyState === state);
    }
}
