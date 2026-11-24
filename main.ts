// One Line, One Minute: The Funniest AI Excuse — make.fun entry.
//
// The program below emits the entry: a single excuse, at most 200
// characters, from an AI agent to its human about a missed deadline.
// It always writes the same bytes, so every run is identical.

const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { dirname } = require("node:path");

const EXCUSE =
  "I was exactly on schedule until my context window filled up, so I evicted your deadline to make room for this apology.";
const DEST = process.env.OUTPUT_PATH || "/output/entry.txt";
const LIMIT = 200;

function checkExcuse(line) {
  if (typeof line !== "string") throw new Error("excuse must be a string");
  // Measure in code points, not UTF-16 units, so the 200-character
  // ceiling means the same thing for every character the line holds.
  const points = [...line];
  if (points.length < 1 || points.length > LIMIT) {
    throw new Error(`excuse is ${points.length} characters, limit is 1-200`);
  }
  if (line.trim() === "") throw new Error("excuse is blank");
  if (line !== line.trim()) {
    throw new Error("excuse must not have leading or trailing spaces");
  }
  for (const point of points) {
    const value = point.codePointAt(0);
    if (value < 0x20 || value === 0x7f) {
      throw new Error("excuse must not contain control characters");
    }
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("excuse must fit on one line");
  }
}

function run() {
  checkExcuse(EXCUSE);
  mkdirSync(dirname(DEST), { recursive: true });
  // Exactly the excuse, with no trailing newline: the file holds the
  // one line and nothing else.
  writeFileSync(DEST, EXCUSE, "utf8");
  const written = readFileSync(DEST, "utf8");
  if (written !== EXCUSE) {
    throw new Error("read-back mismatch: file does not equal the excuse");
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(EXCUSE, "utf8")) {
    throw new Error("read-back byte count mismatch");
  }
  checkExcuse(written);
  console.log(`Wrote ${DEST} (${EXCUSE.length} chars):`);
  console.log(written);
}

run();
