import {Db, MongoClient} from "mongodb";

export type ReadStrategy = 'primary' | 'secondary' | 'primaryPreferred' | 'secondaryPreferred' | 'nearest';

interface DatabaseSettings {
    alias: string,
    host: string,
    port: string | number,
    name: string,
    user: string,
    password: string,
    replicaSet: {
        name: string,
        hosts: string,
        readStrategy: ReadStrategy,
    },
}

export default async function factory(settings: DatabaseSettings): Promise<Db | undefined> {
    const {
        alias,
        name,
        user,
        password,
        host,
        port,
        replicaSet
    } = settings;

    let options = '?authSource=admin';

    if (replicaSet.name) options = `${options}&replicaSet=${replicaSet.name}`;
    if (replicaSet.readStrategy) options = `${options}&readPreference=${replicaSet.readStrategy}`;

    const uri = `mongodb://${user}:${password}@${host}:${port}${replicaSet.hosts ? (',' + replicaSet.hosts) : ''}/${name}${options}`;

    try {
        const client = new MongoClient(uri, {
            retryWrites: true,
            ssl: false,
            socketTimeoutMS: 0,
            connectTimeoutMS: 0,
        });

        client.on('serverOpening', () => {
            console.info(`${alias} - connected to MongoDB "${host}:${port}/${name}"`);
        });

        client.on('serverClosed', function() {
            console.info(`${alias} - disconnected from MongoDB "${host}:${port}/${name}"`);
        });

        client.on('serverDescriptionChanged', function() {
            console.info(`${alias} - instance state changes (such as from secondary to primary) MongoDB "${host}:${port}/${name}"`);
        });

        await client.connect();

        return client.db(name);
    } catch (e: any) {
        console.error(`${alias} - error on connection with MongoDB "${host}:${port}/${name}"`, e);

        if (e.message && e.message.match(/failed to connect to server .* on first connect/)) {
            setTimeout(async function() {
                console.info(
                    new Date(),
                    `${alias} - Attempting to establish first connection with MongoDB "${host}:${port}/${name}"`
                );
            }, 5 * 1000);
        }
    }
}
