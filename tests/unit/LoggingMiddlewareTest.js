"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logging_1 = require("@libs/Middleware/Logging");
describe('LoggingMiddleware', () => {
    describe('getCircularReplacer', () => {
        it('should return "[Circular]" for circular references', () => {
            const obj = {};
            obj.obj = obj;
            const result = (0, Logging_1.serializeLoggingData)(obj);
            expect(result).toEqual({ obj: '[Circular]' });
        });
        it('should return the original value for non-circular references', () => {
            const obj = {};
            obj.foo = 'bar';
            const result = (0, Logging_1.serializeLoggingData)(obj);
            expect(result).toEqual({ foo: 'bar' });
        });
        it('should not stringify function in the object', () => {
            const obj = {
                foo: () => 'bar',
                baz: 'baz',
            };
            const result = (0, Logging_1.serializeLoggingData)(obj);
            expect(result).toEqual({ baz: 'baz' });
        });
    });
});
