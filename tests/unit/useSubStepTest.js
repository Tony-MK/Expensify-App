"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const Text_1 = require("@components/Text");
const useSubStep_1 = require("@hooks/useSubStep");
function MockSubStepComponent({ screenIndex }) {
    return <Text_1.default>{screenIndex}</Text_1.default>;
}
function MockSubStepComponent2({ screenIndex }) {
    return <Text_1.default>{screenIndex}</Text_1.default>;
}
function MockSubStepComponent3({ screenIndex }) {
    return <Text_1.default>{screenIndex}</Text_1.default>;
}
function MockSubStepComponent4({ screenIndex }) {
    return <Text_1.default>{screenIndex}</Text_1.default>;
}
const mockOnFinished = jest.fn();
const mockOnFinished2 = jest.fn();
describe('useSubStep hook', () => {
    describe('given skipSteps as empty array', () => {
        it('returns componentToRender, isEditing, currentIndex, prevScreen, nextScreen, moveTo', () => {
            const { result } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent], onFinished: mockOnFinished, startFrom: 0 }));
            const { componentToRender, isEditing, moveTo, nextScreen, prevScreen, screenIndex } = result.current;
            expect(componentToRender).toBe(MockSubStepComponent);
            expect(isEditing).toBe(false);
            expect(screenIndex).toBe(0);
            expect(typeof prevScreen).toBe('function');
            expect(typeof nextScreen).toBe('function');
            expect(typeof moveTo).toBe('function');
        });
        it('calls onFinished when it is the last step', () => {
            const { result } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent], onFinished: mockOnFinished, startFrom: 0 }));
            const { nextScreen } = result.current;
            (0, react_native_1.act)(() => {
                nextScreen();
            });
            expect(mockOnFinished).toHaveBeenCalledTimes(1);
        });
        it('returns component at requested substep when calling moveTo', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent2, MockSubStepComponent, MockSubStepComponent], onFinished: mockOnFinished, startFrom: 2 }));
            const { moveTo } = result.current;
            (0, react_native_1.act)(() => {
                moveTo(0);
            });
            rerender({});
            const { componentToRender } = result.current;
            expect(componentToRender).toBe(MockSubStepComponent2);
        });
        it('returns substep component at the previous index when calling prevScreen (if possible)', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent2, MockSubStepComponent, MockSubStepComponent], onFinished: mockOnFinished, startFrom: 1 }));
            const { prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(1);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(0);
            expect(componentToRender).toBe(MockSubStepComponent2);
        });
        it('stays on the first substep component when calling prevScreen on the first screen', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent2, MockSubStepComponent, MockSubStepComponent], onFinished: mockOnFinished, startFrom: 0 }));
            const { componentToRender, prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(0);
            expect(componentToRender).toBe(MockSubStepComponent2);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(0);
            expect(newComponentToRender).toBe(MockSubStepComponent2);
        });
    });
    describe('given skipSteps as non-empty array', () => {
        it('calls onFinished when it is the second last step (last step is skipped)', () => {
            const { result } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent, MockSubStepComponent2], onFinished: mockOnFinished2, startFrom: 0, skipSteps: [1] }));
            const { nextScreen } = result.current;
            (0, react_native_1.act)(() => {
                nextScreen();
            });
            expect(mockOnFinished2).toHaveBeenCalledTimes(1);
        });
        it('returns component at requested substep when calling moveTo even though the step is marked as skipped', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent], onFinished: mockOnFinished, startFrom: 2, skipSteps: [1] }));
            const { moveTo } = result.current;
            (0, react_native_1.act)(() => {
                moveTo(1);
            });
            rerender({});
            const { componentToRender } = result.current;
            expect(componentToRender).toBe(MockSubStepComponent3);
        });
        it('returns substep component at the previous index when calling prevScreen (if possible)', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({
                bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent4],
                onFinished: mockOnFinished,
                startFrom: 3,
                skipSteps: [0, 2],
            }));
            const { prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(3);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(1);
            expect(componentToRender).toBe(MockSubStepComponent2);
        });
        it('stays on the first substep component when calling prevScreen on the second screen if the first screen is skipped', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({ bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3], onFinished: mockOnFinished, startFrom: 1, skipSteps: [0] }));
            const { componentToRender, prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(1);
            expect(componentToRender).toBe(MockSubStepComponent2);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(1);
            expect(newComponentToRender).toBe(MockSubStepComponent2);
        });
        it('skips step which are marked as skipped when using nextScreen', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({
                bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent4],
                onFinished: mockOnFinished,
                startFrom: 0,
                skipSteps: [1, 2],
            }));
            const { componentToRender, nextScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(0);
            expect(componentToRender).toBe(MockSubStepComponent);
            (0, react_native_1.act)(() => {
                nextScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(3);
            expect(newComponentToRender).toBe(MockSubStepComponent4);
        });
        it('nextScreen works correctly when called from skipped screen', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({
                bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent4],
                onFinished: mockOnFinished,
                startFrom: 1,
                skipSteps: [1, 2],
            }));
            const { componentToRender, nextScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(1);
            expect(componentToRender).toBe(MockSubStepComponent2);
            (0, react_native_1.act)(() => {
                nextScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(3);
            expect(newComponentToRender).toBe(MockSubStepComponent4);
        });
        it('skips step which are marked as skipped when using prevScreen', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({
                bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent4],
                onFinished: mockOnFinished,
                startFrom: 3,
                skipSteps: [1, 2],
            }));
            const { componentToRender, prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(3);
            expect(componentToRender).toBe(MockSubStepComponent4);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(0);
            expect(newComponentToRender).toBe(MockSubStepComponent);
        });
        it('prevScreen works correctly when called from skipped screen', () => {
            const { result, rerender } = (0, react_native_1.renderHook)(() => (0, useSubStep_1.default)({
                bodyContent: [MockSubStepComponent, MockSubStepComponent2, MockSubStepComponent3, MockSubStepComponent4],
                onFinished: mockOnFinished,
                startFrom: 2,
                skipSteps: [1, 2],
            }));
            const { componentToRender, prevScreen, screenIndex } = result.current;
            expect(screenIndex).toBe(2);
            expect(componentToRender).toBe(MockSubStepComponent3);
            (0, react_native_1.act)(() => {
                prevScreen();
            });
            rerender({});
            const { componentToRender: newComponentToRender, screenIndex: newScreenIndex } = result.current;
            expect(newScreenIndex).toBe(0);
            expect(newComponentToRender).toBe(MockSubStepComponent);
        });
    });
});
