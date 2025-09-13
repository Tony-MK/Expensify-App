"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const ELLIPSIS = '...';
/**
 * Hook for intelligently truncating text with an ellipsis in the middle.
 *
 * This hook:
 * - Measures the width of the referenced text element
 * - Determines if truncation is needed
 * - Preserves text from both the beginning and end for better context
 * - Places an ellipsis in the middle where text is removed
 *
 * @param props Object containing text to truncate and ref to the element
 * @returns Truncated text with ellipsis in the middle if needed, or original text
 */
function useTextWithMiddleEllipsis(props) {
    const { text, ref } = props;
    const [targetWidth, setTargetWidth] = (0, react_1.useState)(0);
    const [shouldTruncate, setShouldTruncate] = (0, react_1.useState)(false);
    const [displayText, setDisplayText] = (0, react_1.useState)(text);
    const [elementStyle, setElementStyle] = (0, react_1.useState)(null);
    const measureDivRef = (0, react_1.useRef)(null);
    /**
     * Creates or retrieves the measurement div element
     */
    const getMeasureDiv = (0, react_1.useCallback)(() => {
        if (measureDivRef.current) {
            return measureDivRef.current;
        }
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.visibility = 'hidden';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = 'auto';
        div.style.whiteSpace = 'nowrap';
        document.body.appendChild(div);
        measureDivRef.current = div;
        return div;
    }, []);
    // Remove measurement div when component unmounts
    (0, react_1.useEffect)(() => {
        return () => {
            if (!measureDivRef.current) {
                return;
            }
            document.body.removeChild(measureDivRef.current);
            measureDivRef.current = null;
        };
    }, []);
    /**
     * Efficiently measures text width by reusing a single div element
     */
    const measureText = (0, react_1.useCallback)((textToMeasure, style) => {
        const div = getMeasureDiv();
        div.textContent = textToMeasure;
        div.style.fontWeight = style.fontWeight;
        div.style.fontStyle = style.fontStyle;
        div.style.fontSize = style.fontSize;
        div.style.lineHeight = style.lineHeight;
        div.style.fontFamily = style.fontFamily;
        return div.getBoundingClientRect().width;
    }, [getMeasureDiv]);
    /**
     * Calculates the target width and determines if truncation is needed
     */
    const calcTargetWidth = (0, react_1.useCallback)(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const style = window.getComputedStyle(element);
        setElementStyle(style);
        const rect = element.getBoundingClientRect();
        setTargetWidth(rect.width);
        if (style && text) {
            const measureWidth = measureText(text, style);
            setShouldTruncate(measureWidth > rect.width);
        }
    }, [text, ref, measureText]);
    // Calculate target width on mount and when text changes
    (0, react_1.useEffect)(() => {
        calcTargetWidth();
    }, [calcTargetWidth]);
    // Handle resize with requestAnimationFrame for better layout timing
    const resetAndMeasure = (0, react_1.useCallback)(() => {
        setDisplayText(text);
        requestAnimationFrame(() => {
            calcTargetWidth();
        });
    }, [text, calcTargetWidth]);
    // Set up resize listener with debounce
    (0, react_1.useEffect)(() => {
        const handleResize = (0, debounce_1.default)(() => {
            resetAndMeasure();
        }, 250);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', resetAndMeasure);
            handleResize.cancel();
        };
    }, [resetAndMeasure]);
    /**
     * Performs the middle truncation algorithm when text needs truncation
     */
    (0, react_1.useEffect)(() => {
        if (!shouldTruncate || !elementStyle) {
            setDisplayText(text);
            return;
        }
        // Splitting text in half to start
        const len = text.length;
        let headChars = Math.floor(len / 2);
        let tailChars = len - headChars;
        let head = text.slice(0, headChars);
        let tail = text.slice(len - tailChars);
        // Binary search to find optimal split point
        while (headChars > 0 && tailChars > 0) {
            const combined = head + ELLIPSIS + tail;
            const combinedWidth = measureText(combined, elementStyle);
            if (combinedWidth <= targetWidth) {
                setDisplayText(combined);
                return;
            }
            // Reduce characters, prioritizing balance between head and tail
            if (headChars > tailChars && headChars > 1) {
                headChars--;
                head = text.slice(0, headChars);
            }
            else if (tailChars > 1) {
                tailChars--;
                tail = text.slice(len - tailChars);
            }
            else {
                break;
            }
        }
        // Fallback for extreme truncation
        const minTruncated = text.slice(0, 1) + ELLIPSIS + text.slice(len - 1);
        setDisplayText(minTruncated);
    }, [elementStyle, shouldTruncate, targetWidth, text, measureText]);
    return displayText;
}
exports.default = useTextWithMiddleEllipsis;
