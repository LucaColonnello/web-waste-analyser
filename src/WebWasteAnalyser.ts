import CoverageExportItemModel from './models/CoverageExportItemModel';
import type { CoverageExportData } from './types';

class WebWasteAnalyser {
  public analyse(coverageExport: CoverageExportData[]): void {
    const coverageExportItems = coverageExport.map(
      (data) => new CoverageExportItemModel(data)
    );
  }
}

export default WebWasteAnalyser;
