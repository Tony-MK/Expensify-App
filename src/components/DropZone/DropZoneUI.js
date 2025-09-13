"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DropZoneUI({ icon, dropTitle, dropStyles, dropTextStyles, dropWrapperStyles, dashedBorderStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flex1, styles.dropWrapper, styles.p2, dropWrapperStyles]}>
            <react_native_1.View style={[styles.borderRadiusComponentLarge, styles.p2, styles.flex1, dropStyles]}>
                <react_native_1.View style={[styles.flex1, styles.justifyContentCenter, styles.alignItemsCenter, styles.pRelative]}>
                    <react_native_1.View style={styles.mb3}>
                        <Icon_1.default src={icon} width={100} height={100}/>
                    </react_native_1.View>
                    <Text_1.default style={[styles.textDropZone, dropTextStyles]}>{dropTitle}</Text_1.default>
                    <react_native_1.View style={[styles.borderRadiusComponentNormal, dashedBorderStyles]}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
DropZoneUI.displayName = 'DropZoneUI';
exports.default = DropZoneUI;
