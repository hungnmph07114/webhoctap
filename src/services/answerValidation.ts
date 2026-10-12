/**
 * Normalize only typographical differences that should not change a short
 * answer. Vietnamese accents and meaningful word boundaries are preserved.
 */
export function normalizeShortAnswer(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .toLocaleLowerCase('vi-VN')
    .replace(/\s+/g, ' ')
    .replace(/(\d)\s+(?=(?:km\/h|cm²|m²|m³|mm|cm|km|kg|mg|ml|m|g|l)(?=$|[\s.,;!?]))/giu, '$1')
    .replace(/(\d)\s+%/g, '$1%')
    .replace(/[.,;!?]+$/u, '');
}

export function isAcceptedShortAnswer(input: string, acceptedAnswers: string[]): boolean {
  const normalizedInput = normalizeShortAnswer(input);
  if (!normalizedInput) return false;

  return acceptedAnswers.some((answer) => normalizeShortAnswer(answer) === normalizedInput);
}
