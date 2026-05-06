import { spawn } from "node:child_process";

const [, , appEnv, ...commandArgs] = process.argv;

if (!appEnv || commandArgs.length === 0) {
  console.error("Usage: node scripts/run-with-env.mjs <local|dev> <command> [...args]");
  process.exit(1);
}

const [command, ...args] = commandArgs;
const child = spawn(command, args, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
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
