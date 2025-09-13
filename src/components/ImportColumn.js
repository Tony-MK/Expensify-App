"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ImportSpreadsheet_1 = require("@libs/actions/ImportSpreadsheet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ButtonWithDropdownMenu_1 = require("./ButtonWithDropdownMenu");
const Text_1 = require("./Text");
// cspell:disable
function findColumnName(header) {
    let attribute = '';
    const formattedHeader = expensify_common_1.Str.removeSpaces(String(header).toLowerCase().trim());
    switch (formattedHeader) {
        case 'email':
        case 'emailaddress':
        case 'emailaddresses':
        case 'e-mail':
        case 'e-mailaddress':
        case 'e-mailaddresses':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.EMAIL;
            break;
        case 'category':
        case 'categories':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.EMAIL;
            break;
        case 'glcode':
        case 'gl':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.GL_CODE;
            break;
        case 'tag':
        case 'tags':
        case 'project':
        case 'projectcode':
        case 'customer':
        case 'name':
            attribute = 'name';
            break;
        case 'submitto':
        case 'submitsto':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.SUBMIT_TO;
            break;
        case 'approveto':
        case 'approvesto':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.APPROVE_TO;
            break;
        case 'payroll':
        case 'payrollid':
        case 'payrolls':
        case 'payrol':
        case 'customfield2':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.CUSTOM_FIELD_2;
            break;
        case 'userid':
        case 'customfield1':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.CUSTOM_FIELD_1;
            break;
        case 'role':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.ROLE;
            break;
        case 'total':
        case 'threshold':
        case 'reporttotal':
        case 'reporttotalthreshold':
        case 'approvallimit':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.REPORT_THRESHHOLD;
            break;
        case 'alternate':
        case 'alternateapprove':
        case 'alternateapproveto':
        case 'overlimitforwardsto':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.APPROVE_TO_ALTERNATE;
            break;
        case 'destination':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.DESTINATION;
            break;
        case 'subrate':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.SUBRATE;
            break;
        case 'amount':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.AMOUNT;
            break;
        case 'currency':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.CURRENCY;
            break;
        case 'rateid':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.RATE_ID;
            break;
        case 'enabled':
        case 'enable':
            attribute = CONST_1.default.CSV_IMPORT_COLUMNS.ENABLED;
            break;
        default:
            break;
    }
    return attribute;
}
function ImportColumn({ column, columnName, columnRoles, columnIndex, shouldShowDropdownMenu = true }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const { containsHeader = true } = spreadsheet ?? {};
    const options = (columnRoles ?? []).map((item) => ({
        text: item.text,
        value: item.value,
        description: item.description ?? (item.isRequired ? translate('common.required') : undefined),
        isSelected: spreadsheet?.columns?.[columnIndex] === item.value,
    }));
    const columnValuesString = column.slice(containsHeader ? 1 : 0).join(', ');
    const colName = findColumnName(column.at(0) ?? '');
    const defaultSelectedIndex = columnRoles?.findIndex((item) => item.value === colName);
    const finalIndex = defaultSelectedIndex !== -1 ? defaultSelectedIndex : 0;
    (0, react_1.useEffect)(() => {
        if (defaultSelectedIndex === -1) {
            return;
        }
        (0, ImportSpreadsheet_1.setColumnName)(columnIndex, colName);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run again
    }, []);
    const columnHeader = containsHeader ? column.at(0) : translate('spreadsheet.column', { name: columnName });
    return (<react_native_1.View style={[styles.importColumnCard, styles.mt4]}>
            <Text_1.default numberOfLines={1} style={[styles.textSupporting, styles.mw100]}>
                {columnHeader}
            </Text_1.default>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt2, styles.justifyContentBetween, styles.w100]}>
                <Text_1.default numberOfLines={2} ellipsizeMode="tail" style={[styles.flex1, styles.flexWrap]}>
                    {columnValuesString}
                </Text_1.default>

                {shouldShowDropdownMenu && (<react_native_1.View style={styles.ml2}>
                        <ButtonWithDropdownMenu_1.default onPress={() => { }} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} shouldShowSelectedItemCheck menuHeaderText={columnHeader} isSplitButton={false} onOptionSelected={(option) => {
                (0, ImportSpreadsheet_1.setColumnName)(columnIndex, option.value);
            }} defaultSelectedIndex={finalIndex} options={options} success={false}/>
                    </react_native_1.View>)}
            </react_native_1.View>
        </react_native_1.View>);
}
ImportColumn.displayName = 'ImportColumn';
exports.default = ImportColumn;
