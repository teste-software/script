import {injectable} from "inversify";
import {FastifyReply, FastifyRequest} from "fastify";

@injectable()
export default class ValidateEventsController {

    constructor() {
        console.log('----------teste')
    }

    async validateCallId(request: FastifyRequest, reply: FastifyReply) {
        // const {call_id} = request.params as { call_id: string };
        // const eventsData = await this.callEventRepository.fetchEvents(call_id); // Simula dados
        //
        // this.validateCallEventsUseCase.execute(call_id, eventsData);

        reply.send({status: "success"});
    }
}
