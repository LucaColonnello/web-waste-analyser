import parseSourceMapComment from '../parseSourceMapComment';

describe('parseSourceMapComment', () => {
  it('returns empty string when source map comment cannot be found', () => {
    const sourceMap = parseSourceMapComment(`const a = 'some code';`);
    expect(sourceMap).toEqual('');
  });

  it('handles base64 source map comments', () => {
    const sourceMap = parseSourceMapComment(`
      const a = 'some code';
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIj=
    `);
    expect(sourceMap).toEqual(
      'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIj='
    );
  });

  it('handles simple url source map comments', () => {
    const sourceMap = parseSourceMapComment(`
      const a = 'some code';
      //# sourceMappingURL=file.min.js.map
    `);
    expect(sourceMap).toEqual('file.min.js.map');
  });
});
