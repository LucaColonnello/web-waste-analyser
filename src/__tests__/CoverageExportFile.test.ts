import CoverageExportFile from '../CoverageExportFile';

describe('CoverageExportFile', () => {
  describe('get lines', () => {
    it('returns lines and columns with valid ranges', () => {
      const instance = new CoverageExportFile({
        text: `const h = 'hello';\nconst w = 'world';\n`,
        ranges: [
          { start: 11, end: 17 },
          { start: 25, end: 30 },
        ],
        url: 'https://www.fakeurl.com/file.js',
      });

      expect(instance.lines).toEqual([
        { line: 1, column: 12 },
        { line: 1, column: 13 },
        { line: 1, column: 14 },
        { line: 1, column: 15 },
        { line: 1, column: 16 },
        { line: 1, column: 17 },
        { line: 1, column: 18 },
        { line: 2, column: 7 },
        { line: 2, column: 9 },
        { line: 2, column: 11 },
        { line: 2, column: 12 },
      ]);
    });

    it('deals with 0-based ranges correctly on multiline text', () => {
      const instance = new CoverageExportFile({
        text: `hel\nlo\n`,
        ranges: [
          { start: 0, end: 17 },
          { start: 19, end: 37 },
        ],
        url: 'https://www.fakeurl.com/file.js',
      });

      expect(instance.lines).toEqual([
        { line: 1, column: 1 },
        { line: 1, column: 2 },
        { line: 1, column: 3 },
        { line: 2, column: 1 },
        { line: 2, column: 2 },
      ]);
    });

    it('returns empty array with invalid ranges', () => {
      const instance = new CoverageExportFile({
        text: `const h = 'hello';\nconst w = 'world';\n`,
        ranges: [{ start: 100, end: 200 }],
        url: 'https://www.fakeurl.com/file.js',
      });

      expect(instance.lines).toEqual([]);
    });
  });
});
