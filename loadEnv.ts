import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appEnv = process.env.APP_ENV || 'local';
const envFiles = [
    '.env',
    '.env.local',
    `.env.${appEnv}`,
    `.env.${appEnv}.local`,
];

for (const envFile of envFiles) {
    dotenv.config({
        path: path.resolve(__dirname, envFile),
        override: true,
    });
}

export const loadedAppEnv = appEnv;
