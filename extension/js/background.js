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
        const parsedURL = new URL(url);
        const token = parsedURL.searchParams.get('mazed-access-token');
        const tokenExpireTime = 5000; // MS
        const isTokenValid = Date.now() - token < tokenExpireTime;

        if (!isRoot && !isTokenValid) {
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
