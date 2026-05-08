export declare function escapeXml(value: unknown): string;
export declare function toLines(text: string, maxChars: number, maxLines: number): string[];
export declare function renderSvg(input: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
  badge?: string;
  accent?: string;
  secondary?: string;
  variant?: 'article' | 'service' | 'tag' | 'static';
}): string;
