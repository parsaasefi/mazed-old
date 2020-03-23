const URIHelper = require('./uri');

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
