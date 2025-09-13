"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const PopoverMenu_1 = require("@components/PopoverMenu");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccountingContext_1 = require("@pages/workspace/accounting/AccountingContext");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ConnectToNetSuiteFlow({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const hasPoliciesConnectedToNetSuite = !!(0, Policy_1.getAdminPoliciesConnectedToNetSuite)()?.length;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [isReuseConnectionsPopoverOpen, setIsReuseConnectionsPopoverOpen] = (0, react_1.useState)(false);
    const [reuseConnectionPopoverPosition, setReuseConnectionPopoverPosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const { popoverAnchorRefs } = (0, AccountingContext_1.useAccountingContext)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const shouldGoToCredentialsPage = (0, connections_1.isAuthenticationError)(policy, CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE);
    const threeDotsMenuContainerRef = popoverAnchorRefs?.current?.[CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE];
    const connectionOptions = [
        {
            icon: Expensicons.LinkCopy,
            text: translate('workspace.common.createNewConnection'),
            onSelected: () => {
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TOKEN_INPUT.getRoute(policyID));
                setIsReuseConnectionsPopoverOpen(false);
            },
        },
        {
            icon: Expensicons.Copy,
            text: translate('workspace.common.reuseExistingConnection'),
            onSelected: () => {
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXISTING_CONNECTIONS.getRoute(policyID));
                setIsReuseConnectionsPopoverOpen(false);
            },
        },
    ];
    (0, react_1.useEffect)(() => {
        if (shouldGoToCredentialsPage || !hasPoliciesConnectedToNetSuite) {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TOKEN_INPUT.getRoute(policyID));
            return;
        }
        setIsReuseConnectionsPopoverOpen(true);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    if (threeDotsMenuContainerRef) {
        if (!isSmallScreenWidth) {
            threeDotsMenuContainerRef.current?.measureInWindow((x, y, width, height) => {
                const horizontal = x + width;
                const vertical = y + height;
                if (reuseConnectionPopoverPosition.horizontal !== horizontal || reuseConnectionPopoverPosition.vertical !== vertical) {
                    setReuseConnectionPopoverPosition({ horizontal, vertical });
                }
            });
        }
        return (<PopoverMenu_1.default isVisible={isReuseConnectionsPopoverOpen} onClose={() => {
                setIsReuseConnectionsPopoverOpen(false);
            }} menuItems={connectionOptions} onItemSelected={(item) => {
                if (!item?.onSelected) {
                    return;
                }
                item.onSelected();
            }} anchorPosition={reuseConnectionPopoverPosition} anchorAlignment={{ horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT, vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP }} anchorRef={threeDotsMenuContainerRef}/>);
    }
}
exports.default = ConnectToNetSuiteFlow;
