"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function mockImages(imagePath) {
    const imageFilenames = fs_1.default.readdirSync(path_1.default.resolve(__dirname, `../assets/${imagePath}/`));
    // eslint-disable-next-line rulesdir/prefer-early-return
    imageFilenames.forEach((fileName) => {
        if (/\.svg/.test(fileName)) {
            jest.mock(`../assets/${imagePath}/${fileName}`, () => () => '');
        }
    });
}
// We are mocking all images so that Icons and other assets cannot break tests. In the testing environment, importing things like .svg
// directly will lead to undefined variables instead of a component or string (which is what React expects). Loading these assets is
// not required as the test environment does not actually render any UI anywhere and just needs them to noop so the test renderer
// (which is a virtual implemented DOM) can do it's thing.
exports.default = () => {
    mockImages('images');
    mockImages('images/avatars');
    mockImages('images/bank-icons');
    mockImages('images/product-illustrations');
};
