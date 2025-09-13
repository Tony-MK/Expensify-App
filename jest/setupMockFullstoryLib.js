"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mockFSLibrary;
function mockFSLibrary() {
    jest.mock('@fullstory/react-native', function () {
        return {
            FSPage: jest.fn(),
            default: jest.fn(),
        };
    });
    jest.mock('@libs/Fullstory', function () {
        var FSPage = /** @class */ (function () {
            function FSPage() {
            }
            FSPage.prototype.start = function () { };
            return FSPage;
        }());
        return {
            Page: FSPage,
            getChatFSClass: jest.fn(),
            init: jest.fn(),
            onReady: jest.fn(),
            consent: jest.fn(),
            identify: jest.fn(),
            consentAndIdentify: jest.fn(),
            anonymize: jest.fn(),
        };
    });
}
