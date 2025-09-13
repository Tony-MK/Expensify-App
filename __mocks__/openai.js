"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockCreate = jest.fn(({ messages }) => {
    const text = messages?.find((m) => m.role === 'user')?.content ?? '';
    return Promise.resolve({
        choices: [
            {
                message: {
                    content: `[ChatGPT] ${text}`,
                },
            },
        ],
    });
});
class MockOpenAI {
    constructor() {
        this.chat = {
            completions: {
                create: mockCreate,
            },
        };
    }
}
exports.default = MockOpenAI;
