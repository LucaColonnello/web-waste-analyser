import CoverageExportFile from './CoverageExportFile';
import type { CoverageExportData } from './types';

class WebWasteAnalyser {
  public analyse(coverageExportData: CoverageExportData[]): void {
    const coverageExportFiles = coverageExportData.map(
      (data) => new CoverageExportFile(data)
    );
  }
}

export default WebWasteAnalyser;
