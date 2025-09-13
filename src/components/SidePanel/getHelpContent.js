"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const HelpDiagnosticData_1 = require("./HelpComponents/HelpDiagnosticData");
const HelpExpandable_1 = require("./HelpComponents/HelpExpandable");
const helpContentMap_1 = require("./HelpContent/helpContentMap");
function getHelpContent(styles, route, isProduction, expandedIndex, setExpandedIndex) {
    const routeParts = route.split('/');
    const helpContentComponents = [];
    let activeHelpContent = helpContentMap_1.default;
    let isExactMatch = true;
    for (const part of routeParts) {
        if (activeHelpContent?.children?.[part]) {
            activeHelpContent = activeHelpContent.children[part];
            if (activeHelpContent.content) {
                helpContentComponents.push(activeHelpContent.content);
            }
        }
        else {
            if (helpContentComponents.length === 0) {
                // eslint-disable-next-line react/no-unescaped-entities
                helpContentComponents.push(() => <Text_1.default style={styles.textHeadlineH1}>We couldn't find any help content for this route.</Text_1.default>);
            }
            isExactMatch = false;
            break;
        }
    }
    const content = helpContentComponents
        .reverse()
        .slice(0, expandedIndex + 2)
        .map((HelpContentNode, index) => {
        return (
        // eslint-disable-next-line react/no-array-index-key
        <react_1.default.Fragment key={`help-content-${index}`}>
                    {index > 0 && <react_native_1.View style={[styles.sectionDividerLine, styles.mv5]}/>}
                    <HelpExpandable_1.default styles={styles} isExpanded={index <= expandedIndex} setIsExpanded={() => setExpandedIndex(index)}>
                        <HelpContentNode styles={styles}/>
                    </HelpExpandable_1.default>
                </react_1.default.Fragment>);
    });
    if (isProduction) {
        return content;
    }
    return (<HelpDiagnosticData_1.default key={`help-diagnostic-data-${route}`} styles={styles} route={route} isExactMatch={isExactMatch}>
            {content}
        </HelpDiagnosticData_1.default>);
}
exports.default = getHelpContent;
