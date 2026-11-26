/**
 * The Robot Vacuum's Funniest Excuse — make.fun bounty entry.
 *
 * Writes exactly one line (1–120 characters): the excuse a robot vacuum
 * gives for missing a spot, to /output/entry.txt.
 *
 * Node 22, standard library only. Deterministic, no network, no input:
 * the entry text is a constant below, guarded by a 1–120 character
 * length gate and verified by reading the file back after writing.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I didn't miss that spot — I looked at the dust, checked my battery, and decided it had squatter's rights.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Length gate: the bounty allows exactly one line of 1–120 characters.
// Count code points (not UTF-16 units) so multi-byte characters such as
// the em dash count as one character, matching the gate's definition.
const MIN_LENGTH = 1;
const MAX_LENGTH = 120;
const entryLength = [...ENTRY].length;
if (entryLength < MIN_LENGTH || entryLength > MAX_LENGTH) {
  throw new Error(
    `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${entryLength}: ${JSON.stringify(ENTRY)}`,
  );
}

// Single-line guard: the entry must be one line, with no line breaks.
if (/[\r\n]/.test(ENTRY)) {
  throw new Error(`Entry must be a single line: ${JSON.stringify(ENTRY)}`);
}

// Content guard: the gate rejects text that is only whitespace.
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only whitespace");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

const readBack = readFileSync(OUTPUT_FILE, "utf8");
if (readBack !== ENTRY) {
  throw new Error(
    `Read-back mismatch: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(readBack)}`,
  );
}

console.log(`Wrote ${entryLength} characters to ${OUTPUT_FILE}`);
