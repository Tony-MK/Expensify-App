import type {OnyxCollection, OnyxEntry} from 'react-native-onyx';
import {reportTransactionsSelector} from '@libs/ReportUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Report, Transaction, TransactionViolation} from '@src/types/onyx';
import useOnyx from './useOnyx';

const DEFAULT_TRANSACTIONS: Transaction[] = [];
const DEFAULT_VIOLATIONS: Record<string, TransactionViolation[]> = {};

function useReportWithTransactionsAndViolations(reportID?: string): [OnyxEntry<Report>, Transaction[], OnyxCollection<TransactionViolation[]>] {
    const [report] = useOnyx(`${ONYXKEYS.COLLECTION.REPORT}${reportID ?? CONST.DEFAULT_NUMBER_ID}`);
    const [transactions] = useOnyx(ONYXKEYS.COLLECTION.TRANSACTION, {
        selector: (_transactions) => reportTransactionsSelector(_transactions, reportID),
    });
    const [violations] = useOnyx(ONYXKEYS.COLLECTION.TRANSACTION_VIOLATIONS, {
        selector: (allViolations) =>
            Object.fromEntries(
                Object.entries(allViolations ?? {}).filter(([key]) =>
                    transactions?.some((transaction) => transaction.transactionID === key.replace(ONYXKEYS.COLLECTION.TRANSACTION_VIOLATIONS, '')),
                ),
            ),
    });
    return [report, transactions ?? DEFAULT_TRANSACTIONS, violations ?? DEFAULT_VIOLATIONS];
}

export default useReportWithTransactionsAndViolations;
