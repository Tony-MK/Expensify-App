"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ImportSpreadsheet_1 = require("@libs/actions/ImportSpreadsheet");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Button_1 = require("./Button");
const FixedFooter_1 = require("./FixedFooter");
const ImportColumn_1 = require("./ImportColumn");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
const ScrollView_1 = require("./ScrollView");
const Switch_1 = require("./Switch");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function ImportSpreadsheetColumns({ spreadsheetColumns, columnNames, columnRoles, errors, importFunction, isButtonLoading, learnMoreLink, shouldShowColumnHeader = true, shouldShowDropdownMenu = true, customHeaderText, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [spreadsheet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const { containsHeader = true } = spreadsheet ?? {};
    return (<>
            <ScrollView_1.default>
                <react_native_1.View style={styles.mh5}>
                    <Text_1.default>
                        {customHeaderText ?? (<>
                                {translate('spreadsheet.importDescription')}
                                <TextLink_1.default href={learnMoreLink ?? ''}>{` ${translate('common.learnMore')}`}</TextLink_1.default>.
                            </>)}
                    </Text_1.default>
                    {shouldShowColumnHeader && (<react_native_1.View style={[styles.mt7, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                            <Text_1.default style={[styles.flex1, styles.mr2]}>{translate('spreadsheet.fileContainsHeader')}</Text_1.default>
                            <Switch_1.default accessibilityLabel={translate('spreadsheet.fileContainsHeader')} isOn={containsHeader} 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onToggle={ImportSpreadsheet_1.setContainsHeader}/>
                        </react_native_1.View>)}
                    {spreadsheetColumns.map((column, index) => {
            return (<ImportColumn_1.default key={columnNames.at(index)} column={column} columnName={columnNames.at(index) ?? ''} columnRoles={columnRoles} columnIndex={index} shouldShowDropdownMenu={shouldShowDropdownMenu}/>);
        })}
                </react_native_1.View>
            </ScrollView_1.default>
            <FixedFooter_1.default addBottomSafeAreaPadding>
                <OfflineWithFeedback_1.default shouldDisplayErrorAbove errors={errors} errorRowStyles={styles.mv2} canDismissError={false}>
                    <Button_1.default text={translate('common.import')} onPress={importFunction} isLoading={isButtonLoading} isDisabled={isOffline} pressOnEnter success large/>
                </OfflineWithFeedback_1.default>
            </FixedFooter_1.default>
        </>);
}
ImportSpreadsheetColumns.displayName = 'ImportSpreadsheetColumns';
exports.default = ImportSpreadsheetColumns;
