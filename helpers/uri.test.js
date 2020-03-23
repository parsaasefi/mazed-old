const URIHelper = require('./uri');

test('Add protocol to the URI', () => {
  expect(URIHelper.addProtocol('http://sample.com')).toBe('http://sample.com');
  expect(URIHelper.addProtocol('sample.com')).toBe('https://sample.com');
  expect(URIHelper.addProtocol('hTtP://SamplE.com')).toBe('hTtP://SamplE.com');
  expect(URIHelper.addProtocol('sample.com/TeSt')).toBe(
    'https://sample.com/TeSt'
  );
});
