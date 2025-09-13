"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImportSpreadsheet_1 = require("@libs/actions/ImportSpreadsheet");
function useCloseImportPage() {
    const isClosing = (0, react_1.useRef)(false);
    const setIsClosing = (0, react_1.useCallback)((value) => {
        isClosing.current = value;
    }, []);
    (0, react_1.useEffect)(() => {
        return () => {
            if (!isClosing.current) {
                return;
            }
            (0, ImportSpreadsheet_1.closeImportPage)();
        };
    }, []);
    return { setIsClosing };
}
exports.default = useCloseImportPage;
