import path from "path";

const env = process.env.NODE_ENV || 'local';

export = {
    cloud_identifier: process.env.CLOUD_IDENTIFIER || '',
    env: env,
    auth: {
        token: {
            key: process.env.JWT_KEY || '',
            expiresIn: process.env.JWT_EXPIRES_IN || 56000
        }
    },
    db: {
        main: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '1206',
            name: process.env.DB_NAME || '55TELECOM_INTEGRATION',
            user: process.env.DB_USER || 'dbpbxadmin',
            pass: process.env.DB_PASS || '1!m5D5Bp!X',
            replicaSet: {
                name: process.env.DB_REPLICA_NAME || '',
                hosts: process.env.DB_REPLICA_HOSTS || '',
                readStrategy: process.env.DB_REPLICA_READ_STRATEGY || 'nearest'
            }
        },
        log: {
            host: process.env.DB_LOG_HOST || '127.0.0.1',
            port: process.env.DB_LOG_PORT || '1206',
            name: process.env.DB_LOG_NAME || '55TELECOM_INTEGRATION',
            user: process.env.DB_LOG_USER || 'dbpbxadmin',
            pass: process.env.DB_LOG_PASS || '1!m5D5Bp!X',
            replicaSet: {
                name: process.env.DB_LOG_REPLICA_NAME || '',
                hosts: process.env.DB_LOG_REPLICA_HOSTS || '',
                readStrategy: process.env.DB_LOG_REPLICA_READ_STRATEGY || 'nearest'
            }
        },
        realtime: {
            host: process.env.DB_REALTIME_HOST || '127.0.0.1',
            port: process.env.DB_REALTIME_PORT || '1206',
            name: process.env.DB_REALTIME_NAME || '55TELECOM_REALTIME',
            user: process.env.DB_REALTIME_USER || 'dbpbxadmin',
            pass: process.env.DB_REALTIME_PASS || '1!m5D5Bp!X',
            replicaSet: {
                name: process.env.DB_REALTIME_REPLICA_NAME || '',
                hosts: process.env.DB_REALTIME_REPLICA_HOSTS || '',
                readStrategy: process.env.DB_REALTIME_REPLICA_READ_STRATEGY || 'primaryPreferred'
            }
        },
    },
    logger: {
        file: process.env.LOGGER_FILE || ''
    },
    module: {
        dir: process.env.MODULE_DIR || `${process.cwd()}/storage/lib`,
        npm: process.env.NPM_DIR || `/usr/bin`,
        git: process.env.GIT_DIR || process.env.GIT_LOCATION || process.env.NPM_DIR || `/usr/bin`,
        // @ts-ignore
        revision: process.env.MODULE_REVISION || {
            'production': 'master',
            'staging': 'master',
            'testing': 'testing',
            'development': 'development',
        }[env] || 'master',
    },
    server: {
        https: {
            port: process.env.SERVER_HTTPS_PORT || 443,
            ssl: {
                default: {
                    key: process.env.SSL_55PBX_COM_KEY || path.resolve(__dirname, `../storage/ssl/55pbx_com.key`),
                    cert: process.env.SSL_55PBX_COM_CERT || path.resolve(__dirname, `../storage/ssl/55pbx_com.crt`),
                    ca: process.env.SSL_55PBX_COM_CA_BUNDLE || path.resolve(__dirname, `../storage/ssl/55pbx_com.ca_bundle`),
                },
                br: {
                    key: process.env.SSL_55PBX_COM_BR_KEY,
                    cert: process.env.SSL_55PBX_COM_BR_CERT,
                    ca: process.env.SSL_55PBX_COM_BR_CA_BUNDLE
                }
            }
        },
        socket: {
            port: process.env.SERVER_SOCKET_PORT || 443,
        }
    },
};

