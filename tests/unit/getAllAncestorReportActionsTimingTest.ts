/* eslint-disable @typescript-eslint/naming-convention */
import {beforeEach} from '@jest/globals';
import type {OnyxEntry} from 'react-native-onyx';
import Onyx from 'react-native-onyx';
import {getAllAncestorReportActions} from '@libs/ReportUtils';
import waitForBatchedUpdates from '@libs/waitForBatchedUpdates';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Report, ReportAction} from '@src/types/onyx';

/**
 * Test to demonstrate the timing issue between getAllAncestorReportActions and Onyx updates
 * This test shows why we need to pass currentUpdatedReport parameter to getAllAncestorReportActions
 */
describe('getAllAncestorReportActions timing issue', () => {
    beforeEach(() => {
        Onyx.clear();
    });

    it('should use fresh report data when provided instead of stale Onyx data', async () => {
        // Setup: Create a report hierarchy (parent -> child)
        const parentReport: Report = {
            reportID: 'parent-report-1',
            reportName: 'Parent Report',
            lastReadTime: '2024-01-01 10:00:00.000',
            lastVisibleActionCreated: '2024-01-01 10:00:00.000',
        };

        const childReport: Report = {
            reportID: 'child-report-1', 
            reportName: 'Child Report',
            parentReportID: 'parent-report-1',
            parentReportActionID: 'action-1',
            lastReadTime: '2024-01-01 09:00:00.000', // Earlier than parent = unread
            lastVisibleActionCreated: '2024-01-01 10:30:00.000', // Later than lastReadTime = has unread
        };

        // Store initial data in Onyx
        await Onyx.multiSet({
            [`${ONYXKEYS.COLLECTION.REPORT}${parentReport.reportID}`]: parentReport,
            [`${ONYXKEYS.COLLECTION.REPORT}${childReport.reportID}`]: childReport,
            [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`]: {
                'action-1': {
                    reportActionID: 'action-1',
                    actionName: CONST.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    created: '2024-01-01 10:00:00.000',
                } as ReportAction,
            },
        });
        await waitForBatchedUpdates();

        // Simulate a report update with newer data (what would come from subscription callback)
        const updatedParentReport: Report = {
            ...parentReport,
            lastReadTime: '2024-01-01 11:00:00.000', // User read the report = no longer unread
            lastVisibleActionCreated: '2024-01-01 11:00:00.000',
        };

        // At this point, Onyx still has the old data, but subscription callback has fresh data
        
        // Test 1: Without fresh data - would use stale Onyx data
        const ancestorsWithStaleData = getAllAncestorReportActions(childReport);
        
        // Test 2: With fresh data - uses the updated report
        const ancestorsWithFreshData = getAllAncestorReportActions(childReport, updatedParentReport);

        // The key insight: If we didn't pass updatedParentReport, the function would use 
        // getReportOrDraftReport() which gets data from Onyx, which might be stale.
        // By passing updatedParentReport, it uses the fresh data for calculations.
        
        // In a real scenario, this would affect unread marker calculations
        // The ancestor with fresh data would show the correct unread status
        // while the one with stale data might show incorrect status

        // Both should have the same number of ancestors (the parent)
        expect(ancestorsWithStaleData).toHaveLength(1);
        expect(ancestorsWithFreshData).toHaveLength(1);

        // The key difference would be in properties calculated from the report data
        // like shouldDisplayNewMarker which depends on lastReadTime vs lastVisibleActionCreated
        const staleAncestor = ancestorsWithStaleData[0];
        const freshAncestor = ancestorsWithFreshData[0];

        // With stale data: Uses old lastReadTime (09:00) vs lastVisibleActionCreated (10:30) = unread
        // With fresh data: Uses new lastReadTime (11:00) vs lastVisibleActionCreated (11:00) = read
        
        // Note: The actual unread calculation is complex and involves multiple factors
        // This test demonstrates the concept of why fresh data matters
        expect(staleAncestor.report.reportID).toBe(parentReport.reportID);
        expect(freshAncestor.report.reportID).toBe(parentReport.reportID);
        
        // Fresh ancestor should use the updated report data
        expect(freshAncestor.report.lastReadTime).toBe('2024-01-01 11:00:00.000');
    });

    it('should fall back to Onyx data when currentUpdatedReport does not match ancestor', async () => {
        // Setup reports
        const grandparentReport: Report = {
            reportID: 'grandparent-report-1',
            reportName: 'Grandparent Report', 
            lastReadTime: '2024-01-01 10:00:00.000',
        };

        const parentReport: Report = {
            reportID: 'parent-report-1',
            reportName: 'Parent Report',
            parentReportID: 'grandparent-report-1', 
            parentReportActionID: 'action-grandparent',
            lastReadTime: '2024-01-01 10:00:00.000',
        };

        const childReport: Report = {
            reportID: 'child-report-1',
            reportName: 'Child Report', 
            parentReportID: 'parent-report-1',
            parentReportActionID: 'action-parent',
            lastReadTime: '2024-01-01 10:00:00.000',
        };

        await Onyx.multiSet({
            [`${ONYXKEYS.COLLECTION.REPORT}${grandparentReport.reportID}`]: grandparentReport,
            [`${ONYXKEYS.COLLECTION.REPORT}${parentReport.reportID}`]: parentReport,
            [`${ONYXKEYS.COLLECTION.REPORT}${childReport.reportID}`]: childReport,
            [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${grandparentReport.reportID}`]: {
                'action-grandparent': {
                    reportActionID: 'action-grandparent',
                    actionName: CONST.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    created: '2024-01-01 10:00:00.000',
                } as ReportAction,
            },
            [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${parentReport.reportID}`]: {
                'action-parent': {
                    reportActionID: 'action-parent', 
                    actionName: CONST.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                    created: '2024-01-01 10:00:00.000',
                } as ReportAction,
            },
        });
        await waitForBatchedUpdates();

        // Update only the parent report
        const updatedParentReport: Report = {
            ...parentReport,
            lastReadTime: '2024-01-01 11:00:00.000',
        };

        // When getting ancestors of child, pass updated parent
        const ancestors = getAllAncestorReportActions(childReport, updatedParentReport);

        // Should get both parent and grandparent as ancestors
        expect(ancestors).toHaveLength(2);

        // First ancestor should be parent (immediate ancestor)
        const parentAncestor = ancestors[0];
        expect(parentAncestor.report.reportID).toBe(parentReport.reportID);
        // Should use fresh data for parent
        expect(parentAncestor.report.lastReadTime).toBe('2024-01-01 11:00:00.000');

        // Second ancestor should be grandparent
        const grandparentAncestor = ancestors[1]; 
        expect(grandparentAncestor.report.reportID).toBe(grandparentReport.reportID);
        // Should use Onyx data for grandparent (since updatedParentReport doesn't match)
        expect(grandparentAncestor.report.lastReadTime).toBe('2024-01-01 10:00:00.000');
    });
});