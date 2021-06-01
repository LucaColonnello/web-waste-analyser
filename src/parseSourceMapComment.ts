// courtesy of https://github.com/thlorenz/convert-source-map
const SOURCEMAP_REGEXP =
  // eslint-disable-next-line no-useless-escape
  /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"`]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/gm;

export default function parseSourceMapComment(text: string): string {
  const matches = Array.from(text.matchAll(SOURCEMAP_REGEXP));
  return matches.length > 0 ? matches[0][1] : '';
}
