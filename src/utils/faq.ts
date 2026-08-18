export type FaqEntry = { question: string; answer: string };

/**
 * Extracts Q/A pairs from a "## Frequently asked questions" section of raw
 * MDX/Markdown source, where each question is an H3 and its answer is the
 * paragraph text that follows (up to the next H3 or the next H2).
 *
 * Returns an empty array when the page has no FAQ section, so callers can
 * skip emitting FAQPage structured data entirely for pages without one.
 */
export function extractFaq(markdown: string): FaqEntry[] {
  const headingMatch = markdown.match(/^##\s+Frequently [Aa]sked [Qq]uestions\s*$/im);
  if (!headingMatch || headingMatch.index === undefined) return [];

  const afterHeading = markdown.slice(headingMatch.index + headingMatch[0].length);
  const nextH2 = afterHeading.match(/^##\s+/m);
  const section = nextH2 && nextH2.index !== undefined ? afterHeading.slice(0, nextH2.index) : afterHeading;

  const blocks = section.split(/^###\s+/m).slice(1);

  return blocks
    .map((block) => {
      const [firstLine, ...rest] = block.split("\n");
      const question = firstLine.trim();
      const answer = stripMarkdown(rest.join(" ").replace(/\s+/g, " ").trim());
      return { question, answer };
    })
    .filter((entry) => entry.question.length > 0 && entry.answer.length > 0);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}
