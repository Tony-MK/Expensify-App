"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = electronServe;
const electron_1 = require("electron");
const fs_1 = require("fs");
const mime_types_1 = require("mime-types");
const path_1 = require("path");
const FILE_NOT_FOUND = -6;
const getPath = async (filePath) => {
    try {
        const result = await fs_1.default.promises.stat(filePath);
        if (result.isFile()) {
            return filePath;
        }
        if (result.isDirectory()) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return getPath(path_1.default.join(filePath, 'index.html'));
        }
    }
    catch {
        return null;
    }
};
function electronServe(options) {
    const mandatoryOptions = {
        isCorsEnabled: true,
        scheme: 'app',
        hostname: '-',
        file: 'index',
        ...options,
    };
    if (!mandatoryOptions.directory) {
        throw new Error('The `directory` option is required');
    }
    mandatoryOptions.directory = path_1.default.resolve(electron_1.app.getAppPath(), mandatoryOptions.directory);
    const handler = async (request, callback) => {
        const filePath = path_1.default.join(mandatoryOptions.directory, decodeURIComponent(new URL(request.url).pathname));
        const resolvedPath = (await getPath(filePath)) ?? path_1.default.join(mandatoryOptions.directory, `${mandatoryOptions.file}.html`);
        const mimeType = mime_types_1.default.lookup(resolvedPath) || 'application/octet-stream';
        try {
            const data = await fs_1.default.promises.readFile(resolvedPath);
            callback({
                mimeType,
                data: Buffer.from(data),
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Document-Policy': 'js-profiling',
                },
            });
        }
        catch (error) {
            callback({ error: FILE_NOT_FOUND });
        }
    };
    electron_1.protocol.registerSchemesAsPrivileged([
        {
            scheme: mandatoryOptions.scheme,
            privileges: {
                standard: true,
                secure: true,
                allowServiceWorkers: true,
                supportFetchAPI: true,
                corsEnabled: mandatoryOptions.isCorsEnabled,
            },
        },
    ]);
    electron_1.app.on('ready', () => {
        const partitionSession = mandatoryOptions.partition ? electron_1.session.fromPartition(mandatoryOptions.partition) : electron_1.session.defaultSession;
        partitionSession.protocol.registerBufferProtocol(mandatoryOptions.scheme, handler);
    });
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return async (window_, searchParameters) => {
        const queryString = searchParameters ? `?${new URLSearchParams(searchParameters).toString()}` : '';
        await window_.loadURL(`${mandatoryOptions.scheme}://${mandatoryOptions.hostname}${queryString}`);
    };
}
