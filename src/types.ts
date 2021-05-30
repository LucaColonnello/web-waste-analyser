export interface CoverageExportRange {
  start: number;
  end: number;
}

export interface CoverageExportData {
  url: string;
  ranges: CoverageExportRange[];
  text: string;
}
