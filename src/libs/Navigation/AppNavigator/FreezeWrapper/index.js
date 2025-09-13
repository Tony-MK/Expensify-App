"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_freeze_1 = require("react-freeze");
const getIsScreenBlurred_1 = require("./getIsScreenBlurred");
function FreezeWrapper({ children }) {
    const navigation = (0, native_1.useNavigation)();
    const currentRoute = (0, native_1.useRoute)();
    const [isScreenBlurred, setIsScreenBlurred] = (0, react_1.useState)(false);
    const [freezed, setFreezed] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('state', (e) => setIsScreenBlurred((0, getIsScreenBlurred_1.default)(e.data.state, currentRoute.key)));
        return () => unsubscribe();
    }, [currentRoute.key, navigation]);
    // Decouple the Suspense render task so it won't be interrupted by React's concurrent mode
    // and stuck in an infinite loop
    (0, react_1.useLayoutEffect)(() => {
        setFreezed(isScreenBlurred);
    }, [isScreenBlurred]);
    return <react_freeze_1.Freeze freeze={freezed}>{children}</react_freeze_1.Freeze>;
}
FreezeWrapper.displayName = 'FreezeWrapper';
exports.default = FreezeWrapper;
