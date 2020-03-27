const URIHelper = require('../uri');

test('Add protocol to the URI', () => {
  expect(URIHelper.addProtocol('http://sample.com')).toBe('http://sample.com');
  expect(URIHelper.addProtocol('sample.com')).toBe('https://sample.com');
  expect(URIHelper.addProtocol('hTtP://SamplE.com')).toBe('hTtP://SamplE.com');
  expect(URIHelper.addProtocol('sample.com/TeSt')).toBe(
    'https://sample.com/TeSt'
  );
});

test('Remove www from the URI', () => {
  expect(URIHelper.removeWWW('https://www.sample.com')).toBe(
    'https://sample.com/'
  );
  expect(URIHelper.removeWWW('https://WwW.sample.com')).toBe(
    'https://sample.com/'
  );
  expect(URIHelper.removeWWW('https://sample.com')).toBe('https://sample.com/');
});

test('Check if the URI is shortened', () => {
  expect(URIHelper.isShortened('https://bit.ly')).toBe(true);
  expect(URIHelper.isShortened('https://BiT.ly')).toBe(true);
  expect(URIHelper.isShortened('https://sample.com')).toBe(false);
});

test('Check if to URIs have the same host', () => {
  expect(
    URIHelper.sameHost('https://sample.com/test', 'http://www.sample.com/')
  ).toBe(true);
  expect(
    URIHelper.sameHost('https://SamPle.CoM/test', 'http://sample.com/path/test')
  ).toBe(true);
});

test('Remove tracking parameters from the URI', () => {
  expect(
    URIHelper.removeTrackingParamas('https://sample.com/path/test?ref=123')
  ).toBe('https://sample.com/path/test');
  expect(
    URIHelper.removeTrackingParamas(
      'https://sample.com/test?ref=1234&param=123'
    )
  ).toBe('https://sample.com/test?param=123');
  expect(
    URIHelper.removeTrackingParamas('https://sample.com/test?param=123')
  ).toBe('https://sample.com/test?param=123');
  expect(
    URIHelper.removeTrackingParamas('https://sample.com/path/test?rEf=123')
  ).toBe('https://sample.com/path/test');
});
