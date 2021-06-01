import SourceMapLoaderNotFoundError from './errors/SourceMapLoaderNotFoundError';

import type CoverageExportFile from './CoverageExportFile';
import type {
  ExtractedSourceMap,
  SourceMapLoader,
  SourceMapStore,
} from './types';
import parseSourceMapComment from './parseSourceMapComment';

/**
 * @class SourceMapExtractor
 * @description
 * This class takes care of extracting and loading the source map
 * for a given collection of Chrome's Coverage export files.
 *
 * Using a loaders plugin system, this class delegates the actual
 * loading stratgey to the provided loaders, allowing high extensibility.
 *
 * Loaders run in parallel for all files. If multiple loaders are installed,
 * Promise.race is used to solve concurrency among loaders
 * (i.e. the first loader to return a valid result, takes presedence).
 *
 * Loaders are called only if their test method returns truthy value
 * on a given source map url for any file.
 *
 * This system allows for flexibility, running multiple loaders at the same time
 * as well as testing whether a loader can handle or not a type of url,
 * we can deal with complex and ambigous situations.
 */
export default class SourceMapExtractor {
  constructor(
    /** The loaders to use in order to extract the source maps. */
    private readonly loaders: SourceMapLoader[] = []
  ) {
    if (loaders.length === 0) {
      throw new SourceMapLoaderNotFoundError(
        'No source map loaders found. You need to add at least one source map loader. Check out the usage documentation.'
      );
    }
  }

  private async extractSourceMap(
    coverageExportFile: CoverageExportFile
  ): Promise<ExtractedSourceMap> {
    const sourceMapUrl = parseSourceMapComment(coverageExportFile.text);
    const usableLoaders = this.loaders.filter((loader) =>
      loader.test(sourceMapUrl, coverageExportFile)
    );

    const sourceMapContent =
      usableLoaders.length > 0
        ? await Promise.race(
            usableLoaders.map(
              async (loader) =>
                await loader.load(sourceMapUrl, coverageExportFile)
            )
          )
        : null;

    return {
      sourceMapUrl,
      sourceMapContent,
    };
  }

  /**
   * @method extract
   * @param {CoverageExportFile[]} coverageExportFiles Items of the Chrome's Coverage export
   * @description
   * This method extracts source maps for a given collection of
   * Chrome's Coverage export files using the installed loaders.
   * Extracted source maps are returned in a Map store.
   *
   * @return {Promise<SourceMapStore | null>}
   */
  public async extract(
    coverageExportFiles: CoverageExportFile[]
  ): Promise<SourceMapStore | null> {
    const sourceMapStore: SourceMapStore = new Map();
    await Promise.all(
      coverageExportFiles.map(async (coverageExportFile) => {
        const extractedSourceMap = await this.extractSourceMap(
          coverageExportFile
        );

        sourceMapStore.set(coverageExportFile.url, extractedSourceMap);
      })
    );

    return sourceMapStore;
  }
}
