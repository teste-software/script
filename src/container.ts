import path from "path";
import glob from "glob-promise";
import {Container} from "inversify";
// import {CallEventProcessor} from "./application/CallEventProcessor";
// import {ValidateCallEventsUseCase} from './application/usecases/ValidateCallEventsUseCase';
// import {CallService} from "./domain/services/CallService";
// import {CallEventRepository} from './infrastructure/repository/CallEventRepository';
import FastifyServer from './infrastructure/http/Server';
import ValidateEventsController from "./infrastructure/http/controller/ValidateEvents";
import ValidateEventsRouter from "./infrastructure/http/router/ValidateEvents";

enum Scope {
    TRANSIENT,
    SINGLETON,
    REQUEST
}

enum Type {
    CLASS,
    CONSTANT,
    FACTORY
}

export default async function createContainer() {
    const container = new Container();

    // container.bind(CallEventRepository).toSelf();
    // container.bind(CallService).toSelf();
    // container.bind(CallEventProcessor).toSelf();
    //
    // container.bind(ValidateCallEventsUseCase).toSelf();

    await load(container, path.resolve(__dirname, './infrastructure/http/controller'), Scope.SINGLETON);
    await load(container, path.resolve(__dirname, './infrastructure/http/router'), Scope.SINGLETON);

    await loadList(container, path.resolve(__dirname, './infrastructure/http/router'), 'routers');

    container.bind(FastifyServer).to(FastifyServer).inSingletonScope();

    return container
}

async function loadList(container: Container, dir: string, identifier: string) {

    const files = await glob(dir + "/**/*.js");
    const list = [];
    for (const filename of files) {
        const file = path.parse(filename);

        if (file.name === "index") continue;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        let Class = require(path.join(file.dir, file.name));

        if (typeof Class === "object" && Class.default) Class = Class.default;
        if (typeof Class !== "function") continue;

        const item = container.get(Class);

        list.push(item);
    }

    container.bind(identifier).toConstantValue(list);
}

async function load(
    container: Container,
    dir: string,
    scope: Scope,
    type: Type = Type.CLASS,
    resolution = "default",
    ignoreIndex = true,
    named = false
) {

    if (type === Type.CONSTANT) named = true;

    const files = await glob(dir + "/**/*.js");

    for (const filename of files) {
        const file = path.parse(filename);

        if (file.name.toLowerCase() === "index" && ignoreIndex) continue;

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const module = require(path.join(file.dir, file.name));

        let Class = module;
        const target = module[resolution];

        if (typeof Class === "object" && Class.default) Class = Class.default;
        if (typeof target !== "function") continue;

        let binding;
        switch (type) {
            case Type.CLASS:
                switch (scope) {
                    case Scope.TRANSIENT:
                        binding = container.bind(Class).to(target).inTransientScope();
                        break;
                    case Scope.SINGLETON:
                        console.log('-- Class-', Class)
                        console.log('-- target-', target)
                        binding = container.bind(Class).to(target).inSingletonScope();
                        let e = container.get(target);

                        if (e instanceof ValidateEventsController) {
                            console.log("------ sop quero ter certeza", e.validateCallId);

                        }


                        break;
                    case Scope.REQUEST:
                        binding = container.bind(Class).to(target).inRequestScope();
                        break;
                }
                break;
            case Type.FACTORY:
                switch (scope) {
                    case Scope.REQUEST:
                    case Scope.TRANSIENT:
                        binding = container.bind(Class).toFactory(target);
                        break;
                    case Scope.SINGLETON:
                        binding = container.bind(Class).toDynamicValue(target).inSingletonScope();
                        break;
                }
                break;
            case Type.CONSTANT:
                binding = container.bind(path.parse(file.dir).name).toConstantValue(target);
                break;
        }

        if (binding)
            if (named) binding.whenTargetNamed(file.name);
            else binding.whenTargetIsDefault();

    }

}
