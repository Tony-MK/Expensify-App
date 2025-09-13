"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
function HelpDiagnosticData({ styles, route, children, isExactMatch }) {
    const diagnosticTitle = isExactMatch ? 'Help content found for route:' : 'Missing help content for route:';
    return (<>
            {!!children && (<>
                    {children}
                    <react_native_1.View style={[styles.sectionDividerLine, styles.mv5]}/>
                </>)}
            <Text_1.default style={[styles.textLabelSupportingNormal, styles.mb4]}>Diagnostic data (visible only on staging)</Text_1.default>
            <Text_1.default style={[styles.textHeadlineH1, styles.mb4]}>{diagnosticTitle}</Text_1.default>
            <Text_1.default style={styles.textNormal}>{route}</Text_1.default>
        </>);
}
exports.default = HelpDiagnosticData;
