const baseURI = 'http://localhost:3000';

fetch(`${baseURI}/api/shorteners`)
  .then(res => res.json())
  .then(shorteners => {
    const urls = shorteners.map(url => `*://${url}/*`);

    chrome.webRequest.onBeforeRequest.addListener(
      details => {
        const { url } = details;
        const rootPattern = new RegExp('https?://[^/]+?/?(?!.+)', 'i');
        const isRoot = rootPattern.test(url);

        if (!isRoot) {
          return {
            redirectUrl: `${baseURI}/process?uri=${url}`,
          };
        }

        return null;
      },
      { urls, types: ['main_frame', 'sub_frame'] },
      ['blocking']
    );
  })
  .catch(err => {
    throw new Error(err);
  });
