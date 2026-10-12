/* The first block of a page reaches UP under the floating nav (Step 7).
 *
 * The nav is a sticky pill in flow, ~78px tall below `md` and ~82px from it. In
 * Step 6 the page behind that strip was plain white, so over a black hero the
 * pill sat on a white band and read as detached from the page ("more
 * separated", the client said). A hero that pulls up by exactly the nav's height
 * and pads itself by the same amount keeps its content where it was and lets
 * its own ground -- and its grid lines, and its figure -- run behind the glass.
 *
 * The two numbers are measured (the wrapper is 4.875rem and 5.125rem), not
 * guessed. They have to be literal strings for Tailwind to see them. If the
 * nav's padding or the pill's height ever changes, change them here. */
export const NAV_PULL = '-mt-[4.875rem] pt-[4.875rem] md:-mt-[5.125rem] md:pt-[5.125rem]'

/* The same height as a calc term, for the hero's min-height. */
export const NAV_H = '5.125rem'
