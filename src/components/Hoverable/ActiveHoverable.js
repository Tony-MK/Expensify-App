"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-compiler/react-compiler */
const react_1 = require("react");
const react_native_1 = require("react-native");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const mergeRefs_1 = require("@libs/mergeRefs");
const ValueUtils_1 = require("@libs/ValueUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ActiveHoverable({ onHoverIn, onHoverOut, shouldHandleScroll, shouldFreezeCapture, children, ref }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const elementRef = (0, react_1.useRef)(null);
    const isScrollingRef = (0, react_1.useRef)(false);
    const isHoveredRef = (0, react_1.useRef)(false);
    const isVisibilityHidden = (0, react_1.useRef)(false);
    const updateIsHovered = (0, react_1.useCallback)((hovered) => {
        if (shouldFreezeCapture) {
            return;
        }
        isHoveredRef.current = hovered;
        isVisibilityHidden.current = false;
        if (shouldHandleScroll && isScrollingRef.current) {
            return;
        }
        setIsHovered(hovered);
        if (hovered) {
            onHoverIn?.();
        }
        else {
            onHoverOut?.();
        }
    }, [shouldHandleScroll, shouldFreezeCapture, onHoverIn, onHoverOut]);
    (0, react_1.useEffect)(() => {
        if (!shouldHandleScroll) {
            return;
        }
        const scrollingListener = react_native_1.DeviceEventEmitter.addListener(CONST_1.default.EVENTS.SCROLLING, (scrolling) => {
            isScrollingRef.current = scrolling;
            if (scrolling && isHovered) {
                setIsHovered(false);
                onHoverOut?.();
            }
            else if (!scrolling && elementRef.current?.matches(':hover')) {
                setIsHovered(true);
                onHoverIn?.();
            }
        });
        return () => scrollingListener.remove();
    }, [shouldHandleScroll, isHovered, onHoverIn, onHoverOut]);
    (0, react_1.useEffect)(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                isVisibilityHidden.current = true;
                setIsHovered(false);
            }
            else {
                isVisibilityHidden.current = false;
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);
    const [modal] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const isModalVisible = modal?.isVisible;
    const prevIsModalVisible = (0, usePrevious_1.default)(isModalVisible);
    (0, react_1.useEffect)(() => {
        if (!isModalVisible || prevIsModalVisible) {
            return;
        }
        setIsHovered(false);
    }, [isModalVisible, prevIsModalVisible]);
    const handleMouseEvents = (0, react_1.useCallback)((type) => () => {
        if (shouldFreezeCapture) {
            return;
        }
        const newHoverState = type === 'enter';
        isHoveredRef.current = newHoverState;
        isVisibilityHidden.current = false;
        updateIsHovered(newHoverState);
    }, [shouldFreezeCapture, updateIsHovered]);
    const child = (0, react_1.useMemo)(() => (0, ValueUtils_1.getReturnValue)(children, isHovered), [children, isHovered]);
    const { onMouseEnter, onMouseLeave } = child.props;
    return (0, react_1.cloneElement)(child, {
        ref: (0, mergeRefs_1.default)(elementRef, ref, child.props.ref),
        onMouseEnter: (e) => {
            handleMouseEvents('enter')();
            onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
            handleMouseEvents('leave')();
            onMouseLeave?.(e);
        },
    });
}
exports.default = ActiveHoverable;
