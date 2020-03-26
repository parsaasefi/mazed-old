const baseURI = 'http://localhost:3000';

fetch(`${baseURI}/api/shorteners`)
  .then(res => res.json())
  .then(shorteners => {
    const urls = shorteners.map(url => `*://${url}/*`);

    chrome.webRequest.onBeforeRequest.addListener(
      details => {
        const { url } = details;

        return {
          redirectUrl: `${baseURI}/process?uri=${url}`,
        };
      },
      { urls },
      ['blocking']
    );
  })
  .catch(err => {
    throw new Error(err);
  });
