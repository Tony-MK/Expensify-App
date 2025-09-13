"use strict";
/**
 * The debug utility that ships with react native testing library does not work properly and
 * has limited functionality. This is a better version of it that allows logging a subtree of
 * the app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = debug;
const pretty_format_1 = require("pretty-format");
const react_is_1 = require("react-is");
// These are giant objects and cause the serializer to crash because the
// output becomes too large.
const NativeComponentPlugin = {
    // eslint-disable-next-line no-underscore-dangle
    test: (val) => !!val?._reactInternalInstance,
    serialize: () => 'NativeComponentInstance {}',
};
const format = (input, options) => (0, pretty_format_1.default)(input, {
    plugins: [pretty_format_1.plugins.ReactTestComponent, pretty_format_1.plugins.ReactElement, NativeComponentPlugin],
    highlight: true,
    printBasicPrototype: false,
    maxDepth: options.maxDepth,
});
function getType(element) {
    const type = element.type;
    if (typeof type === 'string') {
        return type;
    }
    if (typeof type === 'function') {
        return type.displayName || type.name || 'Unknown';
    }
    if (react_is_1.default.isFragment(element)) {
        return 'React.Fragment';
    }
    if (react_is_1.default.isSuspense(element)) {
        return 'React.Suspense';
    }
    if (typeof type === 'object' && type !== null) {
        if (react_is_1.default.isContextProvider(element)) {
            return 'Context.Provider';
        }
        if (react_is_1.default.isContextConsumer(element)) {
            return 'Context.Consumer';
        }
        if (react_is_1.default.isForwardRef(element)) {
            if (type.displayName) {
                return type.displayName;
            }
            const functionName = type.render.displayName || type.render.name || '';
            return functionName === '' ? 'ForwardRef' : `ForwardRef(${functionName})`;
        }
        if (react_is_1.default.isMemo(element)) {
            const functionName = type.displayName || type.type.displayName || type.type.name || '';
            return functionName === '' ? 'Memo' : `Memo(${functionName})`;
        }
    }
    return 'UNDEFINED';
}
function getProps(props, options) {
    if (!options.includeProps) {
        return {};
    }
    const { children, ...propsWithoutChildren } = props;
    return propsWithoutChildren;
}
function toJSON(node, options) {
    const json = {
        $$typeof: Symbol.for('react.test.json'),
        type: getType({ type: node.type, $$typeof: Symbol.for('react.element') }),
        props: getProps(node.props, options),
        children: node.children?.map((c) => (typeof c === 'string' ? c : toJSON(c, options))) ?? null,
    };
    return json;
}
function formatNode(node, options) {
    return format(toJSON(node, options), options);
}
/**
 * Log a subtree of the app for debugging purposes.
 *
 * @example debug(screen.getByTestId('report-actions-view-wrapper'));
 */
function debug(node, { includeProps = true, maxDepth = Infinity } = {}) {
    const options = { includeProps, maxDepth };
    if (node == null) {
        console.log('null');
    }
    else if (Array.isArray(node)) {
        console.log(node.map((n) => formatNode(n, options)).join('\n'));
    }
    else {
        console.log(formatNode(node, options));
    }
}
