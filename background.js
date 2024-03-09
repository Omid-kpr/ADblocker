// Listen for requests and block ads
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { cancel: true };
    },
    { urls: defaultfilters },
    ['blocking']
);

// TODO: implement a counter for the number of adds that have been blocked

defaultfilters = [
    //TODO: add advertisment urls
]

//TODO: add a way to add custom urls to the filters