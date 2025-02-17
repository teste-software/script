import 'reflect-metadata';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

(async () => {
    dotenv.config({ path: path.join(__dirname, '../.env') });
    if (fs.existsSync(`/etc/mongod/55telecom.env.${process.env.NODE_ENV}`)) {
        dotenv.config({
            path: path.resolve(`/etc/mongod/55telecom.env.${process.env.NODE_ENV}`),
        });
    }
    process.env.NODE_CONFIG_DIR = path.join(__dirname, "../config");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("config");
})()
