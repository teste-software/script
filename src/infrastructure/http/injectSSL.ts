import {Server as _Server} from "https";
import config from "config";
import fs from "fs";
import path from "path";

export function injectSSL(server: _Server) {
    const optionsSSL = config.get<{ key: string, ca: string, cert: string }>('server.https.ssl.default');

    let options_ssl: { key: Buffer, cert: Buffer, ca?: Buffer } = {
        ca: fs.readFileSync(optionsSSL.ca),
        key: fs.readFileSync(optionsSSL.key),
        cert: fs.readFileSync(optionsSSL.cert),
    };

    if (process.env.NODE_ENV === 'local') options_ssl = {
        key: fs.readFileSync(path.resolve(__dirname, `../../storage/ssl/localhost-ssl.key`)),
        cert: fs.readFileSync(path.resolve(__dirname, `../../storage/ssl/localhost-ssl.crt`)),
    };

    server.setSecureContext(options_ssl);

    if (fs.existsSync(optionsSSL.key)) {
        server.addContext('*.55pbx.com', {
            ca: fs.readFileSync(optionsSSL.ca),
            key: fs.readFileSync(optionsSSL.key),
            cert: fs.readFileSync(optionsSSL.cert),
        });
    }

    const optionsSSL_br = config.get<{ key: string, ca: string, cert: string }>('server.https.ssl.br');
    if (fs.existsSync(optionsSSL_br.key)) {
        server.addContext('*.55pbx.com.br', {
            ca: fs.readFileSync(optionsSSL_br.ca),
            key: fs.readFileSync(optionsSSL_br.key),
            cert: fs.readFileSync(optionsSSL_br.cert),
        });
    }
}
