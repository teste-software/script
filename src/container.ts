import path from "path";
import glob from "glob-promise";
import {Container} from "inversify";
import {Db} from 'mongodb';
import FastifyServer from './infrastructure/http/Server';
import newDbFactory, {ReadStrategy} from './infrastructure/db/index';
import DialingEventService from "./domain/services/events/DialingEventService";
import AnsweredEventService from "./domain/services/events/AnsweredEventService";
import EndAnsweredEventService from "./domain/services/events/EndAnsweredEventService";
import BlockageEventService from "./domain/services/events/BlockageEventService";
import CallbackEventService from "./domain/services/events/CallbackEventService";
import EndIVREventService from "./domain/services/events/EndIVREventService";
import SelectionIVREventService from "./domain/services/events/SelectionIVREventService";
import FinalizationEventService from "./domain/services/events/FinalizationEventService";

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

    const dbLogClient = await newDbFactory({
        alias: process.env.DB_LOG_NAME || '55TELECOM_HOMOLOGA_LOG',
        host: process.env.DB_LOG_HOST || '10.1.1.4',
        port: process.env.DB_LOG_PORT || '1206',
        name: process.env.DB_LOG_NAME || '55TELECOM_HOMOLOGA',
        user: process.env.DB_LOG_USER || 'dbpbxadmin',
        password: process.env.DB_LOG_PASS || '1!m5D5Bp!X',
        replicaSet: {
            name: process.env.DB_LOG_REPLICA_NAME || '',
            hosts: process.env.DB_LOG_REPLICA_HOSTS || '',
            readStrategy: process.env.DB_LOG_REPLICA_READ_STRATEGY as ReadStrategy || 'primaryPreferred',
        },
    })
    container.bind<Db>(Db).toConstantValue(dbLogClient as Db).whenTargetNamed('log');

    await load(container, path.resolve(__dirname, './domain/repository'), Scope.SINGLETON);

    await load(container, path.resolve(__dirname, './domain/services'), Scope.SINGLETON);

    container.bind('getServiceEventByName').toFunction((name: string) => {
        // @to-do torna isso dinamico e coloca os nomes dos eventos em tipo
        switch (name) {
            case 'DISCAGEM':
                return container.get(DialingEventService)
            case 'ATENDIMENTO':
                return container.get(AnsweredEventService)
            case 'FIMATENDIMENTO':
                return container.get(EndAnsweredEventService)
            case 'BLOQUEIO':
                return container.get(BlockageEventService)
            case 'CALLBACK':
                return container.get(CallbackEventService)
            case 'FIMURA':
                return container.get(EndIVREventService)
            case 'SELECAOURA':
                return container.get(SelectionIVREventService)
            case 'SELECAOURA':
                return container.get(FinalizationEventService)
            default:
                throw new Error(`Serviço '${name}' não encontrado no contêiner.`);
        }
    });

    await load(container, path.resolve(__dirname, './application/usecases'), Scope.SINGLETON);

    await load(container, path.resolve(__dirname, './infrastructure/db/schemas/log'), Scope.SINGLETON);
    await load(container, path.resolve(__dirname, './infrastructure/db/repository'), Scope.SINGLETON);


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
                        binding = container.bind(Class).to(target).inSingletonScope();
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
