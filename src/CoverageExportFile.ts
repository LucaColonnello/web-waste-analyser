import type { CoverageExportData, LineAndColumn } from './types';

export default class CoverageExportFile {
  private linesCache: LineAndColumn[] | null = null;

  public constructor(private readonly coverageExport: CoverageExportData) {}

  private calculateLines(): LineAndColumn[] {
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

  get lines(): LineAndColumn[] {
    if (this.linesCache !== null) {
      return this.linesCache;
    }

    this.linesCache = this.calculateLines();
    return this.linesCache;
  }
}
