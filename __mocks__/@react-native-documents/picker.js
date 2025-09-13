"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.pick = exports.keepLocalCopy = void 0;
const keepLocalCopy = jest.fn();
exports.keepLocalCopy = keepLocalCopy;
const pick = jest.fn();
exports.pick = pick;
const types = Object.freeze({
    allFiles: 'public.item',
    audio: 'public.audio',
    csv: 'public.comma-separated-values-text',
    doc: 'com.microsoft.word.doc',
    docx: 'org.openxmlformats.wordprocessingml.document',
    images: 'public.image',
    json: 'public.json',
    pdf: 'com.adobe.pdf',
    plainText: 'public.plain-text',
    ppt: 'com.microsoft.powerpoint.ppt',
    pptx: 'org.openxmlformats.presentationml.presentation',
    video: 'public.movie',
    xls: 'com.microsoft.excel.xls',
    xlsx: 'org.openxmlformats.spreadsheetml.sheet',
    zip: 'public.zip-archive',
});
exports.types = types;
