import { spawn } from "node:child_process";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const [, , appEnv, ...commandArgs] = process.argv;

if (!appEnv || commandArgs.length === 0) {
  console.error("Usage: node scripts/run-with-env.mjs <local|dev> <command> [...args]");
  process.exit(1);
}

const envFiles = [
  ".env",
  ".env.local",
  `.env.${appEnv}`,
  `.env.${appEnv}.local`,
];

const loadedEnv = {};
for (const envFile of envFiles) {
  const result = dotenv.config({
    path: path.join(projectRoot, envFile),
    override: true,
  });
  Object.assign(loadedEnv, result.parsed ?? {});
}

const [command, ...args] = commandArgs;
const child = spawn(command, args, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    ...loadedEnv,
    APP_ENV: appEnv,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
