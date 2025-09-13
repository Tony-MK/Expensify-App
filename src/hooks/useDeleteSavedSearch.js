"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDeleteSavedSearch;
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const SearchContext_1 = require("@components/Search/SearchContext");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const ROUTES_1 = require("@src/ROUTES");
const useLocalize_1 = require("./useLocalize");
function useDeleteSavedSearch() {
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const [hashToDelete, setHashToDelete] = (0, react_1.useState)(0);
    const { translate } = (0, useLocalize_1.default)();
    const { currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const showDeleteModal = (hash) => {
        setIsDeleteModalVisible(true);
        setHashToDelete(hash);
    };
    const handleDelete = () => {
        (0, Search_1.deleteSavedSearch)(hashToDelete);
        setIsDeleteModalVisible(false);
        if (hashToDelete === currentSearchHash) {
            (0, Search_1.clearAdvancedFilters)();
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: (0, SearchQueryUtils_1.buildCannedSearchQuery)(),
            }));
        }
    };
    const DeleteConfirmModal = (<ConfirmModal_1.default title={translate('search.deleteSavedSearch')} onConfirm={handleDelete} onCancel={() => setIsDeleteModalVisible(false)} isVisible={isDeleteModalVisible} prompt={translate('search.deleteSavedSearchConfirm')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>);
    return { showDeleteModal, DeleteConfirmModal };
}
