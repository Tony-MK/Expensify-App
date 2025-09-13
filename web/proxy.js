"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = require("http");
const https_1 = require("https");
const proxyConfig_1 = require("../config/proxyConfig");
dotenv_1.default.config();
if (process.env.USE_WEB_PROXY === 'false') {
    process.stdout.write('Skipping proxy as USE_WEB_PROXY was set to false.\n');
    process.exit();
}
const host = 'www.expensify.com';
const stagingHost = 'staging.expensify.com';
const stagingSecureHost = 'staging-secure.expensify.com';
// eslint-disable-next-line no-console
console.log(`Creating proxy with host: ${host} for production API and ${stagingHost} for staging API`);
/**
 * Local proxy server that hits the production endpoint
 * to get around CORS issues. We use this so that it's
 * possible to work on the app within a limited development
 * environment that has no local API.
 */
const server = http_1.default.createServer((request, response) => {
    let hostname = host;
    let requestPath = request.url;
    // Add CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }
    /**
     * When a request is matching a proxy config path we might direct it to a different host (e.g. staging)
     * For requests matching proxy config patterns we replace the mapping url (prefix) with the actual path.
     * This is done because the staging api root is only intended for the proxy,
     * the actual server request must use the /api path.
     * For example,
     * /api/OpenReport => request sent to production server
     * /staging/api/OpenReport => request sent to staging server
     * /staging-secure/api/OpenReport => request sent to secure staging server
     * /chat-attachments/46545... => request sent to production server
     * /receipts/w_... => request sent to production server
     * /staging/chat-attachments/46545... => request sent to staging server
     */
    if (request.url?.startsWith(proxyConfig_1.default.STAGING_SECURE)) {
        hostname = stagingSecureHost;
        requestPath = request.url.replace(proxyConfig_1.default.STAGING_SECURE, '/');
    }
    else if (request.url?.startsWith(proxyConfig_1.default.STAGING)) {
        hostname = stagingHost;
        requestPath = request.url.replace(proxyConfig_1.default.STAGING, '/');
    }
    const proxyRequest = https_1.default.request({
        hostname,
        method: request.method,
        path: requestPath,
        headers: {
            ...request.headers,
            host: hostname,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'user-agent': request.headers['user-agent']?.concat(' Development-NewDot/1.0'),
        },
        port: 443,
    });
    request.pipe(proxyRequest);
    proxyRequest.on('response', (proxyResponse) => {
        response.writeHead(proxyResponse.statusCode ?? 0, proxyResponse.headers);
        proxyResponse.pipe(response);
    });
    proxyRequest.on('error', (error) => {
        /* eslint-disable-next-line no-console */
        console.log(error);
    });
});
server.listen(9000, () => {
    /* eslint-disable-next-line no-console */
    console.log('Proxy server listening at http://localhost:9000');
});
