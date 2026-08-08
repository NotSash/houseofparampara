/**
 * The site's motion vocabulary.
 *
 * Before this file there were seven different durations (0.9, 0.85, 0.8, 0.7,
 * 0.35, 0.3, 0.2) and two easing curves used interchangeably, none of them
 * named. Every new animation invented its own number, which is how a site
 * ends up feeling subtly inconsistent without anyone being able to say why.
 *
 * Two rules govern everything here.
 *
 * **Reactive motion is fast. Revealed content can be slow.** Anything
 * responding to a pointer or a tap must land inside 300ms, because past that
 * the interface feels like it is thinking rather than answering. Content
 * arriving on scroll is not responding to anything, so it can take its time
 * and should, since that is what reads as considered rather than abrupt.
 *
 * **The curve carries meaning.** A strong expo-out dumps most of its distance
 * in the first few frames, which is right for something leaving and wrong for
 * anything the eye is following. Measured on a previous project: a panel
 * collapsing on the strong curve lost 65% of its height in about 33ms, then
 * crawled through the rest. Nominally a 221ms animation, in practice a snap.
 */

/* ------------------------------------------------------------------ easing */

/**
 * The default. A gentle ease-out that spreads its movement across the whole
 * duration, so the eye can follow it. Use for anything that arrives, expands,
 * or is watched while it changes.
 */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * A strong expo-out: most of the distance is covered immediately, then it
 * settles. Right for something LEAVING, where a quick departure is the point,
 * and for large hero entrances where the drama is wanted.
 *
 * Wrong for anything changing size while being watched. See the note above.
 */
export const EASE_EXIT = [0.16, 1, 0.3, 1] as const

/* --------------------------------------------------------------- durations */

/**
 * 160ms. Colour changes, small state flips, checkbox ticks.
 * Fast enough to feel instantaneous while still being a transition.
 */
export const DUR_FAST = 0.16

/**
 * 240ms. The default for anything reacting to a pointer: hover lifts, card
 * elevation, nav state. Comfortably inside the 300ms reactive ceiling.
 */
export const DUR_BASE = 0.24

/**
 * 400ms. Larger reactive moves that need a little more travel: a panel
 * switching, a drawer sliding.
 */
export const DUR_SLOW = 0.4

/**
 * 700ms. Content revealing itself on scroll. Not reactive, so the ceiling
 * does not apply. Slow here reads as unhurried, which suits the brand.
 */
export const DUR_REVEAL = 0.7

/**
 * 900ms. The hero only. It is the first thing seen, nothing is waiting on it,
 * and the unhurried arrival is the point.
 */
export const DUR_HERO = 0.9

/**
 * 40ms between staggered children. Measured elsewhere as the centre of the
 * useful 30 to 50ms band: below it the sequence is not legible, above it the
 * last item feels late.
 */
export const STAGGER = 0.04

/* ------------------------------------------------------------------ exits */

/**
 * An exit runs at 65% of its entrance.
 *
 * Arriving is content being revealed and can afford to be unhurried. Leaving
 * is an acknowledgement and should feel decisive; anything that lingers on the
 * way out reads as lag rather than polish.
 */
export const EXIT_RATIO = 0.65

/** Turn an entrance duration into its matching exit duration. */
export function exitDuration(enter: number): number {
  return Math.round(enter * EXIT_RATIO * 1000) / 1000
}

/* ------------------------------------------------------------- transitions */

/** Reacting to a pointer or tap. */
export const reactive = { duration: DUR_BASE, ease: EASE } as const

/** Content arriving on scroll. */
export const reveal = { duration: DUR_REVEAL, ease: EASE } as const

/** The hero, and only the hero. */
export const hero = { duration: DUR_HERO, ease: EASE_EXIT } as const

/** Something leaving. Quicker than it arrived, on the departing curve. */
export const exit = { duration: exitDuration(DUR_BASE), ease: EASE_EXIT } as const
