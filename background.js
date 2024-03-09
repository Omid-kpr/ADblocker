// Function to parse and apply adblock filter rules
function applyAdblockFilters(text) {
    const blockingRules = [];
    const hidingRules = [];
    const allowlistRules = [];

    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.startsWith('!')) {
            // Skip comments and section headers
            return;
        }
        if (line.trim() === '') {
            // Skip empty lines
            return;
        }
        if (line.startsWith('||') || line.startsWith('##') || line.startsWith('/')) {
            // Blocking rules
            blockingRules.push(line);
        } else if (line.startsWith('@@')) {
            // Allowlist rules
            allowlistRules.push(line);
        } else {
            // Hiding rules
            hidingRules.push(line);
        }
    });

    // Apply blocking rules
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const url = details.url;
            for (const rule of blockingRules) {
                if (url.match(rule)) {
                    return { cancel: true }; // Block the request
                }
            }
            return { cancel: false }; // Allow the request
        },
        { urls: ['<all_urls>'] },
        ['blocking']
    );

    // Apply hiding rules
    hidingRules.forEach(rule => {
        const selector = rule.trim();
        const style = `${selector} { display: none !important; }`;
        const styleNode = document.createElement('style');
        styleNode.textContent = style;
        document.head.appendChild(styleNode);
    });

    // Apply allowlist rules
    allowlistRules.forEach(rule => {
        const allowlist = rule.trim().split('||')[1];
        const [urlPattern, options] = allowlist.split('$');
        const [url, requestType] = urlPattern.split(',');
        const domain = url.split('domain=')[1];
        chrome.webRequest.onBeforeRequest.addListener(
            function (details) {
                if (details.url.match(url) && (!requestType || details.type === requestType)) {
                    return { cancel: false }; // Allow the request
                }
                return { cancel: true }; // Block the request
            },
            { urls: [url], types: [requestType || ''], domains: domain ? [domain] : [] },
            ['blocking']
        );
    });
}

// Fetch and process the EasyList data
async function get_data() {
    await fetch("https://easylist.to/easylist/easylist.txt")
        .then(response => response.text())
        .then(text => {
            console.log(text);
            applyAdblockFilters(text);
        })
        .catch(error => {
            console.error('Failed to fetch or process EasyList:', error);
        });
}

get_data();
