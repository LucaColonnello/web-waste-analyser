import WebWasteAnalyser from '../WebWasteAnalyser';

describe('WebWasteAnalyser', () => {
  it('returns void', () => {
    const instance = new WebWasteAnalyser();
    expect(instance.analyse([])).toBeUndefined();
  });
});
