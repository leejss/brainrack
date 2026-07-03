export const EXAMPLE_INPUTS = [
  {
    label: "Two Sum",
    query: "1",
    displayTitle: "Two Sum · LeetCode 1",
  },
  {
    label: "Longest Repeating Character Replacement",
    query: "424",
    displayTitle: "Longest Repeating Character Replacement · LeetCode 424",
  },
  {
    label: "Binary Search",
    query: "Binary Search",
    displayTitle: "Binary Search",
  },
] as const;

export function titleForKnownExampleQuery(query: string) {
  const normalizedQuery = query.trim();
  return EXAMPLE_INPUTS.find((example) => example.query === normalizedQuery)
    ?.displayTitle;
}
