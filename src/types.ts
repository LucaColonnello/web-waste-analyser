/**
 * @interface UnusedLineAndColumn
 * @description
 * This interface represents the line and column
 * of an unused char in a resource file content.
 */
export interface UnusedLineAndColumn {
  /** Unused char line */
  line: number;

  /** Unused char column */
  column: number;
}

/**
 * @interface CoverageExportRange
 * @description
 * This interface represents the unused code ranges,
 * as exported from Chrome Dev Tools' Coverage feature.
 *
 * Ranges are 0-based indexed and assume the content as
 * inline, i.e. new lines don't reset the counter.
 */
export interface CoverageExportRange {
  /** Range start, included */
  start: number;

  /** Range end, included */
  end: number;
}

/**
 * @interface CoverageExportData
 * @description
 * This interface represents the data exported from Chrome Dev Tools' Coverage feature.
 */
export interface CoverageExportData {
  /** File url */
  url: string;

  /** File unused ranges */
  ranges: CoverageExportRange[];

  /** File text */
  text: string;
}

/**
 * @interface SourceMapLoader
 * @description
 * This interface represents a source map loader object.
 * Source map loaders are responsible to load source maps
 * based on the path.
 */
export interface SourceMapLoader {
  /**
   * @method test
   * @param {string} sourceMapUrl The source map url to test against
   * @param {CoverageExportData} coverageExportItem An item of the Chrome's Coverage export
   * @description
   * The test method is used to check whether a loader
   * can be used on a specific source map url.
   *
   * @returns {boolean}
   */
  test: (
    sourceMapUrl: string,
    coverageExportItem: CoverageExportData
  ) => boolean;

  /**
   * @method load
   * @param {string} sourceMapUrl The source map url to test against
   * @param {CoverageExportData} coverageExportItem An item of the Chrome's Coverage export
   * @description
   * The load method is invoked only if the test function returns true
   * and it's used to load the source map based on the provided source map url.
   * All invokable loaders run in a Promise.race statement
   *
   * **Example loader**
   * ```js
   * class ExampleSourceMapLoader implements SourceMapLoader {
   *   async load(sourceMapUrl: string): Promise<string> {
   *     // load source map from anywhere and return as string
   *     return '';
   *   }
   *
   *   test(sourceMapUrl: string): boolean {
   *     // check if the source map url can be handled by the loader
   *     return true;
   *   }
   * }
   * ```
   *
   * @returns {Promise<string | null>}
   */
  load: (
    sourceMapUrl: string,
    coverageExportItem: CoverageExportData
  ) => Promise<string | null>;
}

/**
 * @interface ExtractedSourceMap
 * @description
 * This interface represents an extracted source map.
 */
export interface ExtractedSourceMap {
  /** The source map url, as parsed from the file's final comment */
  sourceMapUrl: string;

  /** The source map content, extracted by the loaders */
  sourceMapContent: string | null;
}

/**
 * @type SourceMapStore
 * @description
 * This type represents a store of extracted source maps,
 * contained in a Map data structure.
 * Each source map is referenced by the url of the Chrome's Coverage export
 * file assets it is relevant to.
 *
 * Urls (keys) can be found in instances of CoverageExportData.
 */
export type SourceMapStore = Map<string, ExtractedSourceMap>;
