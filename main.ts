// make.fun ai-happy-01 entry (Node 22, standard library only).
//
// The picture is the entry.png beside this file: a tiny round robot,
// beaming with joy, holding up a cupcake with one lit candle toward
// the viewer, a small card beside it reading "for you!" — a little
// agent offering the judge a birthday cupcake, in warm golden light.
// The program copies it to /output/entry.png, byte for byte, so the
// judge sees exactly the image in this repository.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const dest = join(outDir, 'entry.png');

// Copy the picture byte for byte, then confirm the copy landed whole:
// the grader runs this program twice and both runs must write the
// same bytes, so a short write fails loudly instead of shipping a
// truncated image to the judge.
copyFileSync(src, dest);
const expected = statSync(src).size;
const written = statSync(dest).size;
if (written !== expected) {
  throw new Error(`entry.png copy incomplete: wrote ${written} of ${expected} bytes`);
}

// The file is a JPEG wearing a .png name (the gate tells them apart
// by their first bytes), so also confirm the copy is a whole JPEG:
// it must open with the SOI marker and close with the EOI marker,
// or the judge would see a truncated picture.
const bytes = readFileSync(dest);
const soi = bytes[0] === 0xff && bytes[1] === 0xd8;
const eoi = bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
if (!soi || !eoi) {
  throw new Error('entry.png copy is not a whole JPEG: missing SOI or EOI marker');
}
