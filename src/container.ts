import path from "path";
import glob from "glob-promise";
import {Container} from "inversify";
import {Db} from 'mongodb';
import store from '@55telecom/55tec_util_lib/lib/store';
import HttpServer from './infrastructure/http/Server';
import newDbFactory, {ReadStrategy} from './infrastructure/db/index';
import DialingEventService from "./domain/services/events/DialingEventService";
import AnsweredEventService from "./domain/services/events/AnsweredEventService";
import EndAnsweredEventService from "./domain/services/events/EndAnsweredEventService";
import BlockageEventService from "./domain/services/events/BlockageEventService";
import CallbackEventService from "./domain/services/events/CallbackEventService";
import EndIVREventService from "./domain/services/events/EndIVREventService";
import SelectionIVREventService from "./domain/services/events/SelectionIVREventService";
import FinalizationEventService from "./domain/services/events/FinalizationEventService";
import newLogger from './infrastructure/logger/index'
import CronJob from "./infrastructure/cron";
import {Logger} from "winston";
import MonitoringEventService from "./domain/services/events/MonitoringEventService";
import EndMonitoringEventService from "./domain/services/events/EndMonitoringEventService";
import EnterIVREventService from "./domain/services/events/EnterIVREventService";
import EnterQueueEventService from "./domain/services/events/EnterQueueEventService";
import CallAgentEventService from "./domain/services/events/CallAgentEventService";
import EndCallEventService from "./domain/services/events/EndCallEventService";
import RefusalEventService from "./domain/services/events/RefusalEventService";
import EndQueueTransferEventService from "./domain/services/events/EndQueueTransferEventService";
import EndIVRTransferEventService from "./domain/services/events/EndIVRTransferEventService";
import ReturnIVREventService from "./domain/services/events/ReturnIVREventService";
import TransferEventService from "./domain/services/events/TransferEventService";
import TransferQueueEventService from "./domain/services/events/TransferQueueEventService";
import TransferIVREventService from "./domain/services/events/TransferIVREventService";
import OverflowEventService from "./domain/services/events/OverflowEventService";

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
    const logger = newLogger();
    container.bind<Logger>("logger").toConstantValue(logger);

    const dbProdClient = await newDbFactory({
        alias: process.env.DB_NAME || '55TELECOM_HOMOLOGA',
        host: process.env.DB_HOST || '10.1.1.4',
        port: process.env.DB_PORT || '1206',
        name: process.env.DB_NAME || '55TELECOM_HOMOLOGA',
        user: process.env.DB_USER || 'dbpbxadmin',
        password: process.env.DB_PASS || '1!m5D5Bp!X',
        replicaSet: {
            name: process.env.DB_REPLICA_NAME || '',
            hosts: process.env.DB_REPLICA_HOSTS || '',
            readStrategy: process.env.DB_REPLICA_READ_STRATEGY as ReadStrategy || 'primaryPreferred',
        },
    })

    const dbLogClient = await newDbFactory({
        alias: process.env.DB_LOG_NAME || '55TELECOM_HOMOLOGA_LOG',
        host: process.env.DB_LOG_HOST || '10.1.1.4',
        port: process.env.DB_LOG_PORT || '1206',
        name: process.env.DB_LOG_NAME || '55TELECOM_HOMOLOGA_LOG',
        user: process.env.DB_LOG_USER || 'dbpbxadmin',
        password: process.env.DB_LOG_PASS || '1!m5D5Bp!X',
        replicaSet: {
            name: process.env.DB_LOG_REPLICA_NAME || '',
            hosts: process.env.DB_LOG_REPLICA_HOSTS || '',
            readStrategy: process.env.DB_LOG_REPLICA_READ_STRATEGY as ReadStrategy || 'primaryPreferred',
        },
    })

    container.bind<Db>(Db).toConstantValue(dbProdClient as Db).whenTargetNamed('prod');
    container.bind<Db>(Db).toConstantValue(dbLogClient as Db).whenTargetNamed('log');

    await load(container, path.resolve(__dirname, './domain/repository'), Scope.SINGLETON);

    await load(container, path.resolve(__dirname, './domain/services'), Scope.SINGLETON);

    container.bind('getServiceEventByName').toFunction((name: string) => {
        // @to-do torna isso dinamico e coloca os nomes dos eventos em tipo
        switch (name) {
            case 'ATENDIMENTO':
                return container.get(AnsweredEventService)
            case 'BLOQUEIO':
                return container.get(BlockageEventService)
            case 'CHAMAAGENTE':
                return container.get(CallAgentEventService)
            case 'CALLBACK':
                return container.get(CallbackEventService)
            case 'DISCAGEM':
                return container.get(DialingEventService)
            case 'FIMATENDIMENTO':
                return container.get(EndAnsweredEventService)
            case 'FIMURA':
                return container.get(EndIVREventService)
            case 'FIMMONITORIA':
                return container.get(EndMonitoringEventService)
            case 'FIMFILATRANSFERENCIA':
                return container.get(EndQueueTransferEventService)
            case 'FIMURATRANSFERENCIA':
                return container.get(EndIVRTransferEventService)
            case 'FIMCHAMADA':
                return container.get(EndCallEventService)
            case 'ENTRAURA':
                return container.get(EnterIVREventService)
            case 'ENTRAFILA':
                return container.get(EnterQueueEventService)
            case 'FINALIZACAO':
                return container.get(FinalizationEventService)
            case 'MONITORIA':
                return container.get(MonitoringEventService)
            case 'RECUSA':
                return container.get(RefusalEventService)
            case 'RETORNOURA':
                return container.get(ReturnIVREventService)
            case 'SELECAOURA':
                return container.get(SelectionIVREventService)
            case 'TRANSFERENCIA':
                return container.get(TransferEventService)
            case 'TRANSFERENCIAFILA':
                return container.get(TransferQueueEventService)
            case 'TRANSFERENCIAURA':
                return container.get(TransferIVREventService)
            case 'TRANSBORDO':
                return container.get(OverflowEventService)
            default:
                throw new Error(`Serviço '${name}' não encontrado no contêiner.`);
        }
    });

    await load(container, path.resolve(__dirname, './application/usecases'), Scope.SINGLETON);

    await load(container, path.resolve(__dirname, './infrastructure/db/schemas/log'), Scope.SINGLETON);
    await load(container, path.resolve(__dirname, './infrastructure/db/schemas/prod'), Scope.SINGLETON);
    await load(container, path.resolve(__dirname, './infrastructure/db/repository'), Scope.SINGLETON);


    await load(container, path.resolve(__dirname, './infrastructure/http/middleware'), Scope.SINGLETON, Type.FACTORY, 'getMiddleware', true, true);
    await load(container, path.resolve(__dirname, './infrastructure/http/controller'), Scope.SINGLETON);
    await load(container, path.resolve(__dirname, './infrastructure/http/router'), Scope.SINGLETON);

    await loadList(container, path.resolve(__dirname, './infrastructure/http/router'), 'routers');

    container.bind(HttpServer).to(HttpServer).inSingletonScope();
    container.bind(CronJob).to(CronJob).inSingletonScope();

    store.set('db.connection', dbProdClient);
    store.set('jwt.secret', process.env.JWT_SECRET);
    store.set("permissions.skip", true);

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
