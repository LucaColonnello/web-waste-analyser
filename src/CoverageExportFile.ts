import type {
  CoverageExportData,
  CoverageExportRange,
  UnusedLineAndColumn,
} from './types';

/**
 * @class CoverageExportFile
 * @description
 * CoverageExportFile objects represent items of the Chrome's Coverage export,
 * containing unused ranges, the text (content) and the url of an asset file.
 *
 * Additionally, this model class takes also care of calculating
 * the unused lines and columns based on the unused ranges.
 */
export default class CoverageExportFile {
  /** Used as a cache to memoize the unused chars */
  private unusedCache: UnusedLineAndColumn[] | null = null;

  public constructor(
    /** Contains the coverage export data */
    private readonly coverageExport: CoverageExportData
  ) {}

  private calculateUnusedFromRanges(): UnusedLineAndColumn[] {
    const { ranges, text: code } = this.coverageExport;
    const rangesList = ranges.slice(0);
    const lines = [];

    let currentRange = rangesList.shift();
    let currentChar = 0;
    let currentColumn = 1;
    let currentLine = 1;

    while (currentRange != null && currentChar < code.length) {
      const charAt = code.charAt(currentChar);

      if (charAt === '\n' || charAt === '\r') {
        currentLine++;
        currentColumn = 0;
      } else if (
        currentChar >= currentRange.start &&
        currentChar <= currentRange.end &&
        charAt.match(/[\s\t]/) == null
      ) {
        lines.push({
          line: currentLine,
          column: currentColumn,
        });
      }

      if (currentChar === currentRange.end) {
        currentRange = rangesList.shift();
      }

      currentChar++;
      currentColumn++;
    }

    return lines;
  }

  /**
   * @property {UnusedLineAndColumn[]} unused
   * @description
   * The unused chars from the file content, rappresented as lines and columns.
   */
  get unused(): UnusedLineAndColumn[] {
    if (this.unusedCache !== null) {
      return this.unusedCache;
    }

    this.unusedCache = this.calculateUnusedFromRanges();
    return this.unusedCache;
  }

  /**
   * @property {CoverageExportRange[]} ranges
   * @description
   * The unused ranges, from Chrome's Coverage export data.
   */
  get ranges(): CoverageExportRange[] {
    return this.coverageExport.ranges;
  }

  /**
   * @property {string} text
   * @description
   * The file content, from Chrome's Coverage export data.
   */
  get text(): string {
    return this.coverageExport.text;
  }

  /**
   * @property {string} url
   * @description
   * The file url, from Chrome's Coverage export data.
   */
  get url(): string {
    return this.coverageExport.url;
  }
}
