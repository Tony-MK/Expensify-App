"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDefaultDragAndDrop = () => {
    (0, react_1.useEffect)(() => {
        const dropDragListener = (event) => {
            event.preventDefault();
            if (event.dataTransfer) {
                // eslint-disable-next-line no-param-reassign
                event.dataTransfer.dropEffect = 'none';
            }
        };
        document.addEventListener('dragover', dropDragListener);
        document.addEventListener('dragenter', dropDragListener);
        document.addEventListener('dragleave', dropDragListener);
        document.addEventListener('drop', dropDragListener);
        return () => {
            document.removeEventListener('dragover', dropDragListener);
            document.removeEventListener('dragenter', dropDragListener);
            document.removeEventListener('dragleave', dropDragListener);
            document.removeEventListener('drop', dropDragListener);
        };
    }, []);
};
exports.default = useDefaultDragAndDrop;
