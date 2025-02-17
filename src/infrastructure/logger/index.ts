import winston from "winston";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";

export default function factory(file?: string) {

    const transports: (ConsoleTransportInstance | FileTransportInstance)[] = [
        new winston.transports.Console()
    ];

    if(file) transports.push(new winston.transports.File({"filename": file}));

    return winston.createLogger({
        "format": winston.format.combine(
            // winston.format.timestamp({"format": "YYYY-MM-DD HH:mm:sss"}),
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.printf(ctx => {
                const {
                    // timestamp,
                    level, message, meta, ...opts } = ctx;
                const newCircularReplacer = () => {
                    const seen = new WeakSet();
                    return (k: string, v: any) => {

                        if (typeof v === 'object' && !!v) {
                            if (seen.has(v)) return '[Circular]';
                            seen.add(v);
                        }

                        return v;
                    };
                };
                return `${new Date().toISOString()} | ${level} - ${Object.keys(opts).map(k => `${k} "${opts[k]}"`).join(' - ')} | ${message}${!!meta ? JSON.stringify(meta, newCircularReplacer()) : ''}`;
            })
        ),
        "transports": transports
    });

}
