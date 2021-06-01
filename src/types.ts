import type CoverageExportFile from './CoverageExportFile';

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
   * @param {CoverageExportFile} coverageExportFile An item of the Chrome's Coverage export
   * @description
   * The test method is used to check whether a loader
   * can be used on a specific source map url.
   *
   * @returns {boolean}
   */
  test: (
    sourceMapUrl: string,
    coverageExportFile: CoverageExportFile
  ) => boolean;

  /**
   * @method load
   * @param {string} sourceMapUrl
   * @param {CoverageExportFile} coverageExportFile
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
   * @returns {Promise<string>}
   */
  load: (
    sourceMapUrl: string,
    coverageExportFile: CoverageExportFile
  ) => Promise<string>;
}
