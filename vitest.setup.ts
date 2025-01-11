import { exec } from "child_process";
import { afterAll, beforeAll } from "vitest";

function execute(cmd: string) {
  console.log(cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

beforeAll(async () => {
  await execute("docker compose up -d");
  await execute("sleep 5");
});

afterAll(async () => {
  void execute("docker compose down");
});
