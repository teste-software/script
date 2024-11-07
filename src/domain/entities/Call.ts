import {CallState, CallStateType} from "../valueObjects/CallState";

export default class Call {
    private readonly callId: string;
    private state: CallState = new CallState(CallStateType.PENDING);
    public historiesStates: CallState[] = [ ];

    constructor(callId: string) {
        this.callId = callId;
    }

    applyStateTransition(nextStateType: CallStateType) {
        this.state.canTransitionTo(nextStateType)

        const nextState = new CallState(nextStateType);
        this.historiesStates.push(nextState);
        this.state = nextState;
    }

    getState(): string {
        return this.state.getValue();
    }

    getCallId() {
        return this.callId;
    }
}
