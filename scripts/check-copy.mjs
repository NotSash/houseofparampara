// Fails if an em dash or en dash reaches user-facing text.
//
//   node scripts/check-copy.mjs
//
// Why this exists: em dashes are a tell. A site full of them reads as
// machine-generated, which is the opposite of what a handmade-gifting brand
// needs. They were removed once; this stops them drifting back in.
//
// Code comments are DELIBERATELY exempt. A comment never reaches a visitor,
// and banning them there would only push people into writing worse comments.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOTS = ['app', 'components', 'lib']
const EXTS = new Set(['.ts', '.tsx', '.css'])
const DASHES = /[\u2014\u2013]/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXTS.has(extname(p))) out.push(p)
  }
  return out
}

/**
 * Blank out comments so only real content is checked.
 *
 * Block comments are handled first, because a double slash inside a block
 * comment is not a line comment. A string containing a double slash (a URL,
 * say) is a known false negative, and that is the safe direction to be wrong
 * in: it can only cause a missed dash, never a false alarm on a comment.
 *
 * Replacing with spaces rather than deleting keeps line numbers correct.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/^[^\n]*?\/\/[^\n]*$/gm, (m) => m.replace(/[^\n]/g, ' '))
}

const problems = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n')
    lines.forEach((line, i) => {
      if (DASHES.test(line)) {
        problems.push(`${file}:${i + 1}  ${line.trim().slice(0, 90)}`)
      }
    })
  }
}

if (problems.length) {
  console.error(`\nFound ${problems.length} em or en dash(es) in user-facing text:\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nUse a comma, a colon, or two sentences instead.\n')
  process.exit(1)
}

console.log('copy check: no em or en dashes in user-facing text')
