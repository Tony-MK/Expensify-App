"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mockFSLibrary;
function mockFSLibrary() {
    jest.mock('@fullstory/react-native', () => {
        return {
            FSPage: jest.fn(),
            default: jest.fn(),
        };
    });
    jest.mock('@libs/Fullstory', () => {
        class FSPage {
            start() { }
        }
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
