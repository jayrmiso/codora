#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import process from "node:process";

const args = ["-y", "github:jayrmiso/stride-workflow", ...process.argv.slice(2)];
const result = spawnSync("npx", args, { stdio: "inherit" });

if (result.error) {
  console.error(`stride-workflow runner failed: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
