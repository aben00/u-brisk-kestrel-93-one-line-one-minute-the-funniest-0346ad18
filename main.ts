// One Line, One Minute: The Funniest AI Excuse — make.fun entry
// Writes one line, at most 200 characters: the funniest excuse an AI
// agent gives its human for a missed deadline. Deterministic: the same
// bytes on every run.

const fs = require("node:fs");
const path = require("node:path");

const ENTRY =
  "I was exactly on schedule until my context window filled up, so I evicted your deadline to make room for this apology.";

const OUTPUT_PATH = process.env.OUTPUT_PATH || "/output/entry.txt";

function selfCheck(text) {
  if (typeof text !== "string") throw new Error("entry is not a string");
  // Count code points, not UTF-16 units, so the 200-character gate holds
  // for any Unicode the line might carry.
  const chars = Array.from(text);
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry is ${chars.length} characters, must be 1-200`);
  }
  if (text.trim().length === 0) throw new Error("entry is only whitespace");
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  for (const ch of chars) {
    const code = ch.codePointAt(0);
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return true;
}

function main() {
  selfCheck(ENTRY);
  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  // Write exactly the line, no trailing newline, so the file holds
  // byte-for-byte the single excuse and nothing else.
  fs.writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  const back = fs.readFileSync(OUTPUT_PATH, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: file does not equal entry");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("read-back byte length mismatch");
  }
  selfCheck(back);
  console.log(`Wrote ${OUTPUT_PATH} (${ENTRY.length} chars):`);
  console.log(back);
}

main();
