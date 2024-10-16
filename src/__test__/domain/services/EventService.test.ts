import "reflect-metadata";
import {describe, expect, test, beforeAll} from '@jest/globals';
import EventService from "../../../domain/services/EventService";
import callMockOne from "../../__mock__/callMockOne";
import {Event} from "../../../domain/types/EventTypes";

describe('matching cities to foods', () => {
    beforeAll(() => {
    });

    test('teste', () => {
        const eventService = new EventService();
        const result = eventService.processEvents(callMockOne.callId, callMockOne.events as unknown as Event[])

        console.log('---', result)
        expect(3).toBe(3);
    });
});
