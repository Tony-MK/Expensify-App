"use strict";
/* eslint-disable react/jsx-key */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HelpBulletList_1 = require("@components/SidePanel/HelpComponents/HelpBulletList");
var HelpNumberedList_1 = require("@components/SidePanel/HelpComponents/HelpNumberedList");
var Text_1 = require("@components/Text");
var TextLink_1 = require("@components/TextLink");
var helpContentMap = {
    children: {
        home: {
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Navigating Expensify</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>Get familiar with Expensify’s intuitive navigation system designed for easy access to all your tools.</Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Left-hand Navigation Bar</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        The vertical <Text_1.default style={styles.textBold}>left-hand bar</Text_1.default> is your main navigation hub:
                    </Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Expensify logo</Text_1.default> - Click to return to your Inbox (homepage)
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Inbox</Text_1.default> - Your personalized dashboard with action items and reminders
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Reports</Text_1.default> - Access all your expense reports and filtering tools
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Workspaces</Text_1.default> - Manage company and personal workspace settings
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Account</Text_1.default> - Personal settings, profile, and preferences
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Global Create</Text_1.default> button - Quick access to create reports, expenses, invoices, and chats
                            </Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Inbox Overview</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Your <Text_1.default style={styles.textBold}>Inbox</Text_1.default> serves as the homepage and shows:
                    </Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Smart reminders to submit, approve, or reconcile expenses</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Real-time updates on recent actions and flagged reports</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>List of chats with other employees in your organization</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Personalized action items based on your role and activity</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Chat Features</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>Every expense, report, or workspace has an associated chat for collaboration:</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Text messages</Text_1.default> with rich formatting support
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Images &amp; Documents</Text_1.default> via copy/paste, drag/drop, or attach button
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Expenses</Text_1.default> to track and submit for reimbursement
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Tasks</Text_1.default> to assign and manage work items
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Mentions</Text_1.default> to invite anyone by email or phone number
                            </Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Reports Section</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        The <Text_1.default style={styles.textBold}>Reports</Text_1.default> tab consolidates filtering and reporting:
                    </Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                Use the <Text_1.default style={styles.textBold}>Workspace filter</Text_1.default> inside the Filters menu to refine results
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Apply filters and queries that update automatically</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>View all expense reports across your workspaces</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Quick Actions</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Use the green <Text_1.default style={styles.textBold}>Create</Text_1.default> button to quickly:
                    </Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Start a new chat or conversation</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Create an expense report</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Add an expense or receipt</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Create a task or invoice</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Submit expenses for approval</Text_1.default>,
                    ]}/>

                    <Text_1.default style={[styles.textNormal]}>
                        <Text_1.default style={styles.textBold}>Tip:</Text_1.default> Navigation is consistent across web, mobile, and desktop versions of Expensify.
                    </Text_1.default>
                </react_native_1.View>);
            },
        },
        distance: {
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Distance Expense</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Easily track mileage costs using Expensify’s built-in map feature. Create and submit distance-based expenses right from the web, desktop, or mobile app.
                    </Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Create distance expenses:</Text_1.default> Click the green + button and choose Create expense, then select Distance. Enter your
                                    starting point and destination. You can also add stops if needed.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Submit for approval:</Text_1.default> Choose your workspace and confirm the distance, amount, and date. Add optional notes or
                                    categories, then click Create expense to submit the mileage expense for approval.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Log a round-trip:</Text_1.default> To log a round-trip, use the same location for both start and finish, and include any stops along
                                    the way.
                                </Text_1.default>
                            </Text_1.default>,
                    ]}/>
                </react_native_1.View>);
            },
        },
        r: {
            children: {
                ':concierge': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Concierge</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Concierge is available 24/7 to answer any question you have about anything — whether that’s how to get set up, how to fix a problem, or general best
                                practices. Concierge is a bot, but it’s really smart and can escalate you to a human whenever you want. Say hi — it’s friendly!
                            </Text_1.default>
                        </react_native_1.View>);
                    },
                },
                ':expense': {
                    children: {
                        ':scan': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Scanned</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>A “scanned” expense was created by extracting the relevant details using the Concierge AI.</Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        ':manual': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Manual</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        A “manual” expense has had all its details specified by the workspace member. It was not imported from any system, or scanned from a receipt.
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        ':pendingExpensifyCard': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Expensify Card (pending)</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>
                                        A “pending” Expensify Card expense represents a purchase that was recently made on the card, but has not yet “posted” – meaning, it has not been
                                        formally recognized as a final, complete transaction.
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>Any changes made to this expense will be preserved when the expense posts, typically 2-7 days later.</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>Pending transactions cannot be approved, as the final expense amount will not be confirmed until it posts.</Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        ':expensifyCard': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Expensify Card</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>An “Expensify Card” expense corresponds to a “posted” (meaning, finalized by the bank) purchase.</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Expensify Card expenses cannot be reimbursed as they are centrally paid by the bank account linked to the workspace.
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                    },
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Expense</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>Every expense gets a dedicated chat to discuss that specific expense. The expense consists of:</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Receipt</Text_1.default> – Attach a photo or document to this expense.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Amount</Text_1.default> – The financial total of this transaction.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Description</Text_1.default> – A general explanation of what this expense was for.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Merchant</Text_1.default> – The business this purchase was made at.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Date</Text_1.default> – The day on which the purchase was made.
                                    </Text_1.default>,
                            ]}/>
                            <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                The expense chat is shared with everyone in the approval flow, and will maintain an audit trail of all historical changes.
                            </Text_1.default>
                        </react_native_1.View>);
                    },
                },
                ':chat': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Chat</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Chat is the foundation of New Expensify. Every expense, expense report, workspace, or member has an associated “chat”, which you can use to record additional
                                details, or collaborate with others. Every chat has the following components:
                            </Text_1.default>
                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Header</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                This shows who you are chatting with (or what you are chatting about). You can press the header for more details on the chat, or additional actions to take
                                upon it.
                            </Text_1.default>
                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Comments</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>The core of the chat are its comments, which come in many forms:</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Text</Text_1.default> – Rich text messages stored securely and delivered via web, app, email, or SMS.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Images &amp; Documents</Text_1.default> – Insert photos, screenshots, movies, PDFs, or more, using copy/paste, drag/drop, or the
                                        attach button.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Expenses</Text_1.default> – Share an expense in the chat, either to simply track and document it, or to submit for reimbursement.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Tasks</Text_1.default> – Record a task, and optionally assign it to someone (or yourself!).
                                    </Text_1.default>,
                            ]}/>
                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Actions</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>Hover (or long press) on a comment to see additional options, including:</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>React</Text_1.default> – Throw a ♥️😂🔥 like on anything!
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Reply in thread</Text_1.default> – Go deeper by creating a new chat on any comment.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Mark unread</Text_1.default> – Flag it for reading later, at your convenience.
                                    </Text_1.default>,
                            ]}/>
                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Composer</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>Use the composer at the bottom to write new messages:</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Markdown</Text_1.default> – Format text using <Text_1.default style={styles.textBold}>bold</Text_1.default>,{' '}
                                        <Text_1.default style={styles.textItalic}>italics</Text_1.default>, and{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/chat/Send-and-format-chat-messages" style={styles.link}>
                                            more
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Mention</Text_1.default> – Invite or tag anyone in the world to any chat by putting an @ in front of their email address or phone
                                        number (e.g., <Text_1.default style={styles.textBold}>@awong@marslink.web</Text_1.default>, or <Text_1.default style={styles.textBold}>@415-867-5309</Text_1.default>).
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
                ':policyAdmins': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>#admins</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Every workspace automatically receives a special #admins chat room. Every admin is automatically added to this room as a member. The #admins room is used for
                                several purposes:
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Talking with Concierge, your setup specialist, or your account manager</Text_1.default> – When you first create the workspace,
                                            Concierge and a setup specialist will be added. Feel free to ask any setup questions you have about how to configure the workspace, onboard your
                                            team, connect your accounting, or anything else you might need.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Monitoring workspace changes</Text_1.default> – Every #admins room shows an audit trail of any configuration changes or
                                            significant events happening inside the workspace.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Chatting with other admins</Text_1.default> – The #admins room is a useful space for workspace admins to chat with each other
                                            about anything, whether or not it relates to Expensify.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
                ':expenseReport': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Expense Report</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>Every expense report gets a dedicated chat to discuss expenses, approvals, or anything you like. The expense report chat:</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>Is shared with everyone in the approval flow configured inside the workspace.</Text_1.default>,
                                <Text_1.default style={styles.textNormal}>Will maintain an audit trail of all historical workflow actions (i.e., approvals).</Text_1.default>,
                            ]}/>
                            <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                Press the attach button to add more expenses, or press the header for more options. Press on any expense to go deeper.
                            </Text_1.default>
                        </react_native_1.View>);
                    },
                },
                ':policyExpenseChat': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workspace</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Every workspace member gets a special chat between them and all workspace admins. This is a good place for workspace members to ask questions about expense
                                policy, for workspace admins to explain changes, or for any “formal” conversation to occur between members and admins. Press the attach button to:
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Create expense</Text_1.default> – This will submit an expense to the workspace for reimbursement.
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Split expense</Text_1.default> – This will split an expense between the member and the workspace (e.g., for a business meal that
                                        brings a spouse).
                                    </Text_1.default>,
                            ]}/>
                            <Text_1.default style={[styles.textNormal, styles.mt4]}>All past expense reports are processed here and stored for historical reference.</Text_1.default>
                        </react_native_1.View>);
                    },
                },
                ':policyAnnounce': {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Announce Room (#announce)</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                The #announce room is a chat space available to all workspace members. It’s perfect for sharing company-wide updates, policy changes, or event reminders. The
                                #announce room is accessible from your <Text_1.default style={styles.textBold}>Inbox</Text_1.default> in the left-hand menu.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Post company-wide announcements:</Text_1.default> All members can post in #announce by default, making it easy to communicate
                                            across the workspace.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Restrict posting to admins:</Text_1.default> Workspace admins can limit posting to admins only. Open the #announce room, click
                                            the room header, select Settings, and change Who can post to Admins only.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Everyone can read messages:</Text_1.default> Even if posting is limited to admins, all workspace members can still view
                                            messages in the #announce room.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
            },
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Inbox</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>The Inbox is a prioritized “to do” list, highlighting exactly what you need to do next. It consists of:</Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Priorities</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>At the top of the Inbox are the most important tasks you should do first, which include:</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Expense reports waiting on you</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Tasks assigned to you</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Chats that have mentioned you</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Anything you have pinned</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Chats</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>Beneath the priorities are a list of chats (with unread chats highlighted in bold), in one of two view modes:</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Most Recent</Text_1.default> – Lists every chat, ordered by whichever was most recently active.
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Focus</Text_1.default> – Only lists chats with unread messages, sorted alphabetically.
                            </Text_1.default>,
                    ]}/>
                </react_native_1.View>);
            },
        },
        scan: {
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Scan Receipt</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>SmartScan automatically extracts expense details from receipt images.</Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>How to Scan</Text_1.default>
                    <HelpNumberedList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                Click the <Text_1.default style={styles.textBold}>+</Text_1.default> button and select <Text_1.default style={styles.textBold}>Create expense</Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                Choose <Text_1.default style={styles.textBold}>Scan</Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Upload an image or take a photo of your receipt</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>SmartScan extracts merchant, date, amount, and currency</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Choose your workspace and add any required details</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                Click <Text_1.default style={styles.textBold}>Create expense</Text_1.default>
                            </Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>What SmartScan Detects</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Amount</Text_1.default> and currency
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Merchant</Text_1.default> name and location
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Date</Text_1.default> of purchase
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Tax</Text_1.default> information (when visible)
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Category</Text_1.default> suggestions based on merchant type
                            </Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Supported Receipt Types</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Photos</Text_1.default> - Take with your device camera
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Email receipts</Text_1.default> - Forward to receipts@expensify.com
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>PDF receipts</Text_1.default> - Upload from your device
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={styles.textBold}>Screenshots</Text_1.default> - From apps or websites
                            </Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Tips for Best Results</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Ensure receipt text is clear and readable</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Include the full receipt in the image</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Good lighting improves accuracy</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Straight angles work better than tilted photos</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>After Scanning</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Review extracted details for accuracy</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Add description, category, or tags as needed</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>SmartScan learns from your corrections</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Related Links</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/reports-and-expenses/Create-an-Expense" style={styles.link}>
                                    Create an Expense
                                </TextLink_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/getting-started/Free-Features-in-Expensify" style={styles.link}>
                                    Free Features in Expensify
                                </TextLink_1.default>
                            </Text_1.default>,
                    ]}/>
                </react_native_1.View>);
            },
        },
        workspaces: {
            children: {
                ':policyID': {
                    children: {
                        accounting: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Accounting Integrations</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>
                                        Link your workspace directly to your accounting system to make expense tracking smarter and smoother. We’ll automatically sync your chart of accounts
                                        so your team can code expenses accurately — and approved reports flow right back into your books. Less manual work, more peace of mind.
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Once connected, you can fine-tune your setup with:</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Import settings to control what data comes from your accounting system.</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Export settings to choose how expense reports are sent back.</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Advanced options for automation, such as auto-sync and employee settings.</Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Supported Integrations</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>QuickBooks Online</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Real-time expense sync</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Category and vendor mapping</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Tax rate sync</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>QuickBooks Desktop</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>File-based import/export</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Chart of accounts sync</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Custom field mapping</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Xero</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Auto-sync approved reports</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Import tracking categories</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Manage tax rates seamlessly</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>NetSuite</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Built for complex orgs with multi-entity support</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Custom dimension mapping</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Automated bill payments</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Sage Intacct</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Track departments, classes, and more</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Multi-currency support</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Advanced approval workflows</Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>What Syncs Automatically</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>From your accounting system:</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Chart of accounts (as categories)</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Classes, departments, locations (as tags)</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Tax rates and customers</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Vendors and bill payment accounts</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>To your accounting system:</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Approved expense reports</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Company card transactions</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Vendor bills and journal entries</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Payment records and reconciliation data</Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/connections/quickbooks-online/Connect-to-QuickBooks-Online" style={styles.link}>
                                                    Connect to QuickBooks Online
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/connections/xero/Connect-to-Xero" style={styles.link}>
                                                    Connect to Xero
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/connections/netsuite/Connect-To-NetSuite" style={styles.link}>
                                                    Connect to NetSuite
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        invoices: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Create and Send Invoices</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Send invoices, track their status, and get paid — even if your customer isn’t on Expensify. Invoicing comes included with all Expensify subscriptions.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Set Up Invoicing:</Text_1.default> Add a business bank account to start sending and receiving invoice payments.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Invoice Balance:</Text_1.default> Right up top, you’ll see your current invoice balance — that’s the money you’ve
                                                    collected from paid invoices. If you’ve added a bank account, this balance will transfer automatically.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Customize Your Invoices:</Text_1.default> Make your invoices your own. Add your company name, website, and logo —
                                                    they’ll show up on every invoice you send.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        'distance-rates': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Distance Rates</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Distance rates make it easy to pay employees when they use their personal vehicles for work. You can set different rates for different vehicle types
                                        or travel situations. Just make sure at least one rate is active when this feature is turned on.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>How to set up rates</Text_1.default>: Under{' '}
                                                    <Text_1.default style={styles.textBold}>Workspaces &gt; [Workspace Name] &gt; Distance rates</Text_1.default> and choose{' '}
                                                    <Text_1.default style={styles.textBold}>Add rate</Text_1.default>. Enter how much you’ll reimburse per mile or kilometer and click{' '}
                                                    <Text_1.default style={styles.textBold}>Save</Text_1.default>.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Multiple rate options</Text_1.default>: Customize rates for personal cars, company vehicles, or different types of
                                                    trips.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Managing your rates</Text_1.default>: To save time, you can turn rates on or off, update amounts, or manage them in
                                                    bulk.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textNormal]}>
                                        You can learn more about managing distance rates here ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Set-distance-rates" style={styles.link}>
                                            Set Distance Rates
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        workflows: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workflows</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>
                                        Setting up workflows on your workspace automates how expenses move from submission to payment. They keep things organized and help you control when
                                        expenses are submitted, who approves them, and how they get paid.
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Note:</Text_1.default> Only admins can configure workspace workflows.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Approval setup</Text_1.default>: Assign approvers to review expenses before they’re paid. You can even customize
                                                    approvers for different team members.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Submission timing</Text_1.default>: Pick a daily or weekly schedule for automatic expense submission so no one forgets
                                                    to submit their expenses.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Automated payments</Text_1.default>: Link your business bank account, and Expensify will automatically process
                                                    payments for approved expenses and invoices.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Workspace-Workflows" style={styles.link}>
                                                    Workspace Workflows
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Add-Approvals" style={styles.link}>
                                                    Approval Settings
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        'expensify-card': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Expensify Card</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>
                                        The Expensify Card is a smart company card with real-time controls and built-in cash back. It allows you to issue unlimited virtual cards, set custom
                                        limits for each employee, and manage everything in one place.
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Note:</Text_1.default> You’ll need a connected US business bank account to get started.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Issue cards</Text_1.default>: Hand out virtual or physical cards with flexible spending controls, such as smart
                                                    limits, monthly caps, or fixed amounts.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Smarter spending controls</Text_1.default>: Set custom limits, block certain merchant types, and track every swipe in
                                                    real time.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Easy card management</Text_1.default>: As a workspace admin, you can see all issued cards at a glance. You can adjust
                                                    limits, rename cards, or deactivate them whenever you need to.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textNormal]}>
                                        More details on setting up the Expensify Card for your business can be found here ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/new-expensify/hubs/expensify-card/" style={styles.link}>
                                            The Expensify Card
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        tags: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Tag Settings</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Tags help you track extra details on expenses—like projects, cost centers, locations, or clients—so you can organize your spend beyond just
                                        categories. You can add them manually or sync them automatically from your accounting software.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>How to add tags</Text_1.default>: Click the green + button to add tags manually, or upload up to 50,000 at once with a
                                                    spreadsheet. Using an accounting integration? Your tags will sync automatically.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Organizing tags</Text_1.default>: Use dependent tags (where one relies on another) for more structured tracking, or
                                                    keep things simple with independent tags.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Automatic tagging that gets smarter</Text_1.default>: Expensify learns how you tag expenses and starts doing it for
                                                    you, speeding up and simplifying your workflow over time.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Create-expense-tags" style={styles.link}>
                                                    Create Tags
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Require-tags-and-categories-for-expenses" style={styles.link}>
                                                    Require Tags for Expenses
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        'per-diem': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Per Diem Settings</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Per diem makes it easy to cover travel or recurring allowances with fixed daily rates—no need to track every coffee or cab ride. Employees just pick a
                                        rate and submit. You can create rates manually or import them from a spreadsheet.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Set up rates</Text_1.default>: Create daily rates for different locations, meal types, or travel needs. Just enter the
                                                    amount, and you’re done!
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Default categories</Text_1.default>: Assign a default category to keep all your per diem expenses organized and your
                                                    accounting on track.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textNormal]}>
                                        Learn more about setting up per diem rates here ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Configure-Per-Diem-in-a-workspace" style={styles.link}>
                                            Per Diem Settings
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        taxes: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Tax Settings</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Track VAT, GST, or any other regional taxes right in Expensify. Perfect for staying compliant—especially if you’re working in non-USD currencies. You
                                        can set up different tax rates for your workspace currency and for foreign currencies, too.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>How to set up tax rates</Text_1.default>: Click the green + button to add a tax rate. Just enter the tax name,
                                                    percentage, and tax code for your records.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Default tax settings</Text_1.default>: Set separate default rates for your workspace currency and foreign currencies,
                                                    so everything’s accurate no matter where you’re spending.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Managing tax rates</Text_1.default>: You can turn rates on or off, update their values, or delete them entirely. Use
                                                    bulk actions to move faster, or make changes one at a time.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textNormal]}>
                                        Learn more about workspace tax settings here ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Track-Taxes" style={styles.link}>
                                            Track Taxes
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        rules: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workspace Rules</Text_1.default>
                                    <Text_1.default style={[styles.textNormal, styles.mb4]}>
                                        Rules help you stick to your expense policy without micromanaging. Set limits, require receipts, and automate approvals. Expensify checks every
                                        expense against your rules and flags anything that’s off.
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Note:</Text_1.default> Workspace rules are only available on the Control plan.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Expense requirements:</Text_1.default> Decide when receipts are required, set a max spend per expense, and control how
                                                    far back expenses can be submitted.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Prohibited expenses:</Text_1.default> Let Expensify’s AI catch restricted items like alcohol, gambling, or tobacco—no
                                                    manual review needed.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Automatic approvals:</Text_1.default> Save time by auto-approving compliant reports under a certain amount. You can
                                                    even randomly audit a few to keep everyone honest.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Workspace-Rules" style={styles.link}>
                                                    Workspace Rules
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Prohibited-Expense-Rule" style={styles.link}>
                                                    Prohibited Expense Rules
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        members: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workspace Members</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Invite teammates to your workspace and assign roles to control their access and keep the expense process running smoothly.
                                    </Text_1.default>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Member Roles</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Admin</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Full workspace control and settings access</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Add/remove members and change roles</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Set up integrations and payment methods</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Approve and pay expenses</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Member</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Submit expenses and create reports</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Participate in workspace chats</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>View assigned expenses and reports</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Auditor</Text_1.default>
                                    </Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>View all workspace reports (read-only)</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Add comments, but cannot modify expenses</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>No approval or payment permissions</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Adding Members</Text_1.default>
                                    <HelpNumberedList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                Under <Text_1.default style={styles.textBold}>Workspaces &gt; [Workspace Name] &gt; Members</Text_1.default>, click{' '}
                                                <Text_1.default style={styles.textBold}>Invite Member</Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Enter name, email, or phone number</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Choose a role (defaults to Member)</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                Click <Text_1.default style={styles.textBold}>Invite</Text_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Alternative:</Text_1.default> Share the workspace URL or QR code from{' '}
                                        <Text_1.default style={styles.textBold}>Account &gt; Profile &gt; Share</Text_1.default>
                                    </Text_1.default>
                                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Managing Members</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Change Role:</Text_1.default>
                                    </Text_1.default>
                                    <HelpNumberedList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Click the member’s name</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                Click <Text_1.default style={styles.textBold}>Role</Text_1.default> and select new role
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Confirm changes</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        <Text_1.default style={styles.textBold}>Remove Member:</Text_1.default>
                                    </Text_1.default>
                                    <HelpNumberedList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Click the member’s name</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                Click <Text_1.default style={styles.textBold}>Remove from Workspace</Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Confirm removal</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Transfer Ownership of a Workspace</Text_1.default>
                                    <HelpNumberedList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                Go to <Text_1.default style={styles.textBold}>Members</Text_1.default> and click current <Text_1.default style={styles.textBold}>Owner</Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                Click <Text_1.default style={styles.textBold}>Transfer Owner</Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Confirm transfer</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>You become the new owner</Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Managing-Workspace-Members" style={styles.link}>
                                                    Managing Workspace Members
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Add-Approvals" style={styles.link}>
                                                    Add Approvals
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        'company-cards': {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Company Cards</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Already have business credit cards? You can connect them to Expensify to automatically pull in transactions. Most major banks and card providers are
                                        supported.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>How to connect cards</Text_1.default>: Link your corporate card program to your workspace, assign the cards to the
                                                    corresponding cardholder, and transactions will start syncing automatically as they post—no manual entry needed.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Exporting expenses</Text_1.default>: Send card transactions to your accounting system, either to a shared account or
                                                    separate ones for each cardholder.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>eReceipts</Text_1.default>: Turn on eReceipts to automatically generate digital receipts for USD transactions under
                                                    $75—no more chasing paper ones.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textNormal]}>
                                        More details on connecting your company card program can be found here ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/connect-credit-cards/Company-Card-Settings" style={styles.link}>
                                            Company Card Settings
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        reportFields: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Report Settings</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>Keep your reports clean, consistent, and easy to manage by customizing titles and adding report-level details.</Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Report title</Text_1.default>: Use the Custom Report Names feature (under workspace Rules) to create naming templates
                                                    for new reports. It’s a smarter way to keep things organized and make reports easier to find. You also have the option to prevent members
                                                    from changing the custom report names you set.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Report fields</Text_1.default>: Collect high-level info—like project names, client codes, or trip types—that applies
                                                    to the whole report, not just individual expenses. Report fields are filled out once and apply to all expenses in that report.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Turn on and Manage Report Fields</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        <Text_1.default style={styles.textBold}>Note:</Text_1.default> This setting requires the Control plan.
                                    </Text_1.default>
                                    <HelpNumberedList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                Under <Text_1.default style={styles.textBold}>Workspaces &gt; More Features</Text_1.default>, toggle on <Text_1.default style={styles.textBold}>Report fields</Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                Head to <Text_1.default style={styles.textBold}>Workspaces &gt; [Workspace Name] &gt; Reports</Text_1.default> to add, edit, or delete fields
                                            </Text_1.default>,
                                    ]}/>
                                    <Text_1.default style={[styles.textNormal, styles.mt4]}>
                                        You can choose from field types like Text, Date, or a List with predefined options — whatever best fits your workflow. Learn more ➡️{' '}
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Enable-Report-Fields" style={styles.link}>
                                            Enable Report Fields
                                        </TextLink_1.default>
                                        .
                                    </Text_1.default>
                                </react_native_1.View>);
                            },
                        },
                        overview: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workspace Overview</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>Set up the essentials — name, description, currency, address, and subscription plan — all in one spot.</Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Choose your workspace currency:</Text_1.default> Pick a default currency. No matter what currency members use, we’ll
                                                    convert everything automatically.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Add workspace details:</Text_1.default> Give your workspace a name, add a quick description, and drop in your company
                                                    address. These show up on reports and invoices, so make it yours.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Manage your subscription:</Text_1.default> Your plan controls what features you get and how much you pay per active
                                                    user. Hit Explore all plans to switch things up or adjust your size.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                        categories: {
                            content: function (_a) {
                                var styles = _a.styles;
                                return (<react_native_1.View>
                                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Category Settings</Text_1.default>
                                    <Text_1.default style={[styles.textNormal]}>
                                        Categories help you organize expenses so your reports and accounting stay clean and easy to manage. Think of them as your chart of accounts or GL
                                        codes. You can add them manually or, if you use accounting software, import them straight from the integration.
                                    </Text_1.default>

                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Category settings made simple:</Text_1.default> You can toggle categories on or off, add GL codes, and set rules like
                                                    receipt requirements or spending limits, all in one place under{' '}
                                                    <Text_1.default style={styles.textBold}>Workspaces &gt; [Workspace Name] &gt; Categories</Text_1.default>.
                                                </Text_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <Text_1.default style={[styles.textNormal]}>
                                                    <Text_1.default style={styles.textBold}>Smarter categorization, automatically:</Text_1.default> Expensify learns how you tag your expenses and starts
                                                    automatically applying those categories to similar merchants. This means less busywork and more accuracy.
                                                </Text_1.default>
                                            </Text_1.default>,
                                    ]}/>

                                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                                    <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Create-expense-categories" style={styles.link}>
                                                    Create Expense Categories
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/workspaces/Require-tags-and-categories-for-expenses" style={styles.link}>
                                                    Require Categories
                                                </TextLink_1.default>
                                            </Text_1.default>,
                                    ]}/>
                                </react_native_1.View>);
                            },
                        },
                    },
                },
            },
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Workspaces 101</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Think of a workspace as mission control for your company’s expenses. It’s where you set the rules, invite the team, and connect to your accounting tools. Each
                        workspace runs independently, so you can keep things tidy across departments, entities, or clients.
                    </Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Create a new workspace</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Hit the <Text_1.default style={styles.textBold}>New workspace</Text_1.default> button to get started. Add a name, set a default currency, and you’re ready to get started customizing the
                        workspace settings!
                    </Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Invite your team</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>Add teammates to your workspace to manage expenses and approvals in one central place:</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>Members can submit and approve reports they’re assigned to.</Text_1.default>,
                        <Text_1.default style={styles.textNormal}>Admins can approve all reports and manage workspace settings.</Text_1.default>,
                    ]}/>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Automate approvals</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Toggle on <Text_1.default style={styles.textBold}>Add Approvals</Text_1.default> under <Text_1.default style={styles.textBold}>Workflows</Text_1.default> to set a default first approver. Create custom
                        approval flows for individual team members if needed.
                    </Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Connect your accounting system</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>Link your workspace with QuickBooks Online, Xero, NetSuite, or Sage Intacct to sync expenses like a pro.</Text_1.default>
                    <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Enhance your workspace with extra features</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        Under <Text_1.default style={styles.textBold}>More Features</Text_1.default>, enable extras like the Expensify Card, distance rates, custom categories and tags, and company card
                        connections.
                    </Text_1.default>

                    <Text_1.default style={[styles.textNormal]}>
                        <Text_1.default style={styles.textBold}>Tip:</Text_1.default> If you manage multiple departments, clients, or entities, consider creating multiple workspaces. Separate workspaces can
                        help keep settings, approvals, and payments organized and more automated.
                    </Text_1.default>
                </react_native_1.View>);
            },
        },
        settings: {
            children: {
                preferences: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Preferences</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Your preferences shape how Expensify looks and feels just for you. Customize your language, theme, and notification settings to customize your experience
                                across all your devices.
                            </Text_1.default>

                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Notifications</Text_1.default>: Decide which alerts you want to receive, such as feature updates, news, or sound
                                            notifications. You’re in control.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Priority mode:</Text_1.default> Choose how chats appear in your inbox – Focus on unread and pinned chats, or keep everything
                                            visible, with the most recent messages shown at the top of the left-hand menu.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Language options</Text_1.default>: You can update your interface in just a few clicks by choosing from 10 supported languages.
                                            Choose your preferred language from the list, and your account will update automatically.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Payment Currency:</Text_1.default> Set your default currency for expense tracking and reimbursements.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Theme:</Text_1.default> Change the app’s appearance to suit your preference:
                                        </Text_1.default>

                                        <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>
                                                    <Text_1.default style={styles.textBold}>Dark Mode</Text_1.default> - Easy on the eyes in low-light environments
                                                </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                    <Text_1.default style={styles.textBold}>Light Mode</Text_1.default> - Bright, clean interface for well-lit spaces
                                                </Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>
                                                    <Text_1.default style={styles.textBold}>Use Device Settings</Text_1.default> - Automatically match your device’s theme
                                                </Text_1.default>,
                                    ]}/>
                                    </>,
                            ]}/>

                            <Text_1.default style={[styles.textNormal]}>
                                <Text_1.default style={styles.textBold}>Note:</Text_1.default> Preference changes only affect your personal account view. Workspace members must update their own settings
                                individually.
                            </Text_1.default>
                        </react_native_1.View>);
                    },
                },
                security: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Security</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                This is where you control who can access your account and how secure it is. From adding two-factor authentication to merging accounts, it’s all in one spot.
                            </Text_1.default>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Two-Factor Authentication</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                This adds an extra layer of protection to your Expensify account. Even if someone gets your login info, they won’t be able to access it without a code from
                                your authenticator app.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Set it up in a minute:</Text_1.default> Use an app like Google Authenticator or Microsoft Authenticator to link your account.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Don’t skip the backup codes:</Text_1.default> Download or save your recovery codes somewhere safe. You’ll need them if you
                                            ever lose access to your app.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>How login works:</Text_1.default> You’ll log in with your email magic code and a 6-digit code from your authenticator app.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Merge Accounts</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                If you’ve ended up with two Expensify accounts, you can merge them to keep expense history and workspace access under a single login.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Heads up:</Text_1.default> Merging is permanent and must be done from your company account by pulling in the personal one.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>How to merge:</Text_1.default> Under <Text_1.default style={styles.textBold}>Account &gt; Security &gt; Merge accounts</Text_1.default>, add the
                                            email address of the account you’re merging and then enter the magic code sent to your email.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>What moves over:</Text_1.default> Expenses, reports, cards, co-pilots — everything from the merged account rolls over into
                                            your existing account.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Report Suspicious Activity</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                If something feels off or you’re concerned a bad actor has gained access to your account, report it by clicking{' '}
                                <Text_1.default style={styles.textBold}>Report suspicious activity</Text_1.default>. This will fully lock down your account and halt Expensify Card transactions immediately.
                            </Text_1.default>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Close Account</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>If you need to close your Expensify account, you can do that here — there are just a few things to check off first.</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Before you close:</Text_1.default> Make sure to transfer ownerships, clear any balances, and update billing contacts.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>After closing the account:</Text_1.default> Shared reports and expenses will still be accessible to workspace admins, but all
                                            your personal data will be wiped.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/settings/Two-Factor-Authentication" style={styles.link}>
                                            Two-Factor Authentication
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/settings/Lock-Account-Tool" style={styles.link}>
                                            Report Suspicious Activity
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/settings/Merge-Accounts" style={styles.link}>
                                            Merge Accounts
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/settings/Close-Account" style={styles.link}>
                                            Close Account
                                        </TextLink_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
                subscription: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Subscription Plan</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Your subscription plan determines which features are available and how much you’re charged per active member. Choose the one that fits your team’s needs and
                                budget!
                            </Text_1.default>

                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Expensify offers two plans – Collect and Control:</Text_1.default> The Collect plan is $5 per member each month. The Control
                                            plan ranges from $9 to $36 per member/month, depending on your subscription commitment and how much your team uses the Expensify Card.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Add a payment card:</Text_1.default> To pay for your subscription, add a payment card under{' '}
                                            <Text_1.default style={styles.textBold}>Account &gt; Subscription</Text_1.default>. Charges will automatically be billed to this card each month.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Change plan:</Text_1.default> You can switch plans by clicking <Text_1.default style={styles.textBold}>Explore all plans</Text_1.default>. You can
                                            upgrade your plan or increase your subscription size at any time.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Request Tax-Exempt Status:</Text_1.default> Under{' '}
                                            <Text_1.default style={styles.textBold}>Account &gt; Subscription &gt; Subscription settings</Text_1.default>, click{' '}
                                            <Text_1.default style={styles.textBold}>Tax exempt status</Text_1.default>. This kicks off a chat with Concierge, where you can request that your account be
                                            tax-exempt and then upload a PDF of your exemption document. Our team will review everything and reach out if we need anything else.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/billing-and-subscriptions/Billing-Overview" style={styles.link}>
                                            Billing Overview
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/billing-and-subscriptions/Changing-Your-Workspace-Plan" style={styles.link}>
                                            Change Workspace Plan
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/billing-and-subscriptions/Tax-Exemption" style={styles.link}>
                                            Tax Exemption
                                        </TextLink_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
                profile: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Profile</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Your profile is where you control how you show up in Expensify. Update your photo, name, status, and timezone so teammates know who they’re working with.
                                Private info like your legal name and address stays visible to you only.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Setting your status</Text_1.default>: Add a custom status (yep, emojis included) to show if you’re in a meeting, out of
                                            office, or just heads-down for a bit.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Managing contact methods</Text_1.default>: Add backup emails or phone numbers to keep your account secure and accessible, even
                                            if your primary email changes.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
                wallet: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Wallet</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Your Wallet is the hub for all things money in Expensify. This is where you connect and manage your business and personal bank accounts, view company card
                                details, and control how money moves in and out of your organization. Whether you’re reimbursing employees, collecting payments, or issuing Expensify Cards,
                                it all starts here.
                            </Text_1.default>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Business Bank Accounts</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Connect a verified business bank account to unlock smart features like reimbursements, bill pay, invoice collection, and the Expensify Card.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Turn on payments:</Text_1.default> Head to{' '}
                                            <Text_1.default style={styles.textBold}>Workspaces &gt; [Workspace Name] &gt; More features</Text_1.default>, click{' '}
                                            <Text_1.default style={styles.textBold}>Enable workflows</Text_1.default>, then toggle on <Text_1.default style={styles.textBold}>Make or track payments</Text_1.default>. From there, hit{' '}
                                            <Text_1.default style={styles.textBold}>Connect bank account</Text_1.default> to get started.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Connect your account:</Text_1.default> Use Plaid to link your account in seconds, or enter your details manually. You’ll need
                                            to upload an ID, add your company info, and verify the account with a few test transactions.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <>
                                        <Text_1.default style={styles.textBold}>Once your account is verified, you can:</Text_1.default>

                                        <HelpBulletList_1.default styles={styles} items={[
                                        <Text_1.default style={styles.textNormal}>Reimburse employees via ACH</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Pay vendors and suppliers</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Issue Expensify Cards to your team</Text_1.default>,
                                        <Text_1.default style={styles.textNormal}>Collect invoice payments from clients</Text_1.default>,
                                    ]}/>
                                    </>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={styles.textBold}>Share access to the bank account with another admin:</Text_1.default> Under{' '}
                                        <Text_1.default style={styles.textBold}>Settings &gt; Account &gt; Wallet</Text_1.default>, click <Text_1.default style={styles.textBold}>Share</Text_1.default> next to the bank account, and
                                        enter the admin’s email. They’ll just need to revalidate the bank account on their end before they can issue payments.
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Personal Bank Accounts</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                If you want to get reimbursed or paid directly in Expensify, add a personal bank account — Expensify supports banks in over 190 countries.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Add your bank account</Text_1.default>: Under <Text_1.default style={styles.textBold}>Settings &gt; Wallet &gt; Bank accounts</Text_1.default>,
                                            click <Text_1.default style={styles.textBold}>Add bank account</Text_1.default>, choose your country, and connect via Plaid or enter your info manually.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Note:</Text_1.default> Personal bank accounts are for receiving funds only. You’ll need a verified business bank account to
                                            send payments or issue Expensify Cards.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mv4]}>Assigned Cards</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Company cards are assigned at the workspace level, but are visible to the individual cardholder in their <Text_1.default style={styles.textBold}>Wallet</Text_1.default>. The
                                cards sync automatically, so you can skip manually entering credit card expenses.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>See card details (Expensify Card):</Text_1.default> Click <Text_1.default style={styles.textBold}>Reveal details</Text_1.default> to check your
                                            card number, expiration date, and security code for online purchases.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Track expenses smarter:</Text_1.default> Transactions pull in automatically and match with SmartScanned receipts to keep
                                            records audit-ready.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>View transactions:</Text_1.default> Click on a connected card and then <Text_1.default style={styles.textBold}>View transactions</Text_1.default>{' '}
                                            to see all of the imported expenses from that company card.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>

                            <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/wallet-and-payments/Connect-a-Business-Bank-Account" style={styles.link}>
                                            Connect a Business Bank Account
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/wallet-and-payments/Connect-a-Personal-Bank-Account" style={styles.link}>
                                            Connect a Personal Bank Account
                                        </TextLink_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/expensify-card/Cardholder-Settings-and-Features" style={styles.link}>
                                            Expensify Cardholder Settings and Features
                                        </TextLink_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
            },
        },
        new: {
            children: {
                task: {
                    content: function (_a) {
                        var styles = _a.styles;
                        return (<react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Tasks</Text_1.default>
                            <Text_1.default style={[styles.textNormal]}>
                                Keep conversations organized by letting you create actionable to-dos directly within a chat. You can assign them to yourself or others in both 1:1 and group
                                chats.
                            </Text_1.default>
                            <HelpBulletList_1.default styles={styles} items={[
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Create a task:</Text_1.default> In any chat, click the + button next to the message field and select Assign a task. Add a
                                            title (required) and an optional description, and choose an assignee from chat participants. You can also leave it unassigned to track it
                                            yourself.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Use tasks to stay on top of action items:</Text_1.default> Tasks are great for follow-ups like “Submit expense report,” “Share
                                            slide deck,” or “Update mileage rate.” They’re perfect for 1:1 check-ins, project updates, or organizing next steps after a team discussion.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Edit and manage tasks:</Text_1.default> Task creators and assignees can comment, edit the title or description, reassign the
                                            task, or mark it as complete. Just click the task to update any details.
                                        </Text_1.default>
                                    </Text_1.default>,
                                <Text_1.default style={styles.textNormal}>
                                        <Text_1.default style={[styles.textNormal]}>
                                            <Text_1.default style={styles.textBold}>Tasks stay visible:</Text_1.default> Each task is shared in the chat where it’s created. When completed, it will be clearly
                                            marked in the chat and can be reopened if needed.
                                        </Text_1.default>
                                    </Text_1.default>,
                            ]}/>
                        </react_native_1.View>);
                    },
                },
            },
        },
        search: {
            content: function (_a) {
                var styles = _a.styles;
                return (<react_native_1.View>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mv4]}>Reports Page</Text_1.default>
                    <Text_1.default style={[styles.textNormal]}>
                        The Reports page helps you explore and filter all reports and related expenses. It complements the Inbox by giving you a complete view of your expense history and
                        what expenses and reports require your action. Use this page to create and download spending reports, track report actions, and view the recent expense activity on
                        your workspace(s).
                    </Text_1.default>

                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Expenses &amp; Reports</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Managing expenses</Text_1.default>: Click on any expense row to see its details in a side panel. Use checkboxes to select multiple
                                    expenses, then use bulk actions like Move, Download, or Delete from the action menu.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Filters</Text_1.default>: Looking for something specific? Use filters to narrow things down by date, category, merchant, tag,
                                    workspace, or report status. You can also combine filters with keywords for even more precise results.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Sort reports by status</Text_1.default>: - Draft – Only you can see it - Outstanding – Waiting on someone else - Approved – Ready to
                                    pay - Done or Paid – All wrapped up
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Download what you need</Text_1.default>: Generate a report to download filtered expense data as a CSV. Perfect for spreadsheets,
                                    monthly close, or syncing with accounting.
                                </Text_1.default>
                            </Text_1.default>,
                    ]}/>

                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Chats</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Viewing report previews</Text_1.default>: Each report preview shows up right in your workspace chat with the status, up to 10
                                    expenses, and buttons like Submit or Approve, depending on your role.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Filter chats:</Text_1.default> Use filters to find the exact chat you’re looking for.
                                </Text_1.default>
                            </Text_1.default>,
                    ]}/>

                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>To-Do</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Stay on top of tasks</Text_1.default>: The To-do section shows exactly what needs your attention. This is your go-to spot to keep
                                    things moving.
                                </Text_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <Text_1.default style={[styles.textNormal]}>
                                    <Text_1.default style={styles.textBold}>Action items:</Text_1.default> Whether you need to submit, approve, or pay expenses, you can click the corresponding action to
                                    complete any outstanding to-dos.
                                </Text_1.default>
                            </Text_1.default>,
                    ]}/>

                    <Text_1.default style={[styles.textHeadlineH2, styles.mt4, styles.mb1]}>Learn More</Text_1.default>
                    <HelpBulletList_1.default styles={styles} items={[
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/reports-and-expenses/Getting-Started-with-the-Reports-Page" style={styles.link}>
                                    The Reports Page
                                </TextLink_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/reports-and-expenses/Understanding-Report-Statuses-and-Actions" style={styles.link}>
                                    Understanding Reports Statuses and Actions
                                </TextLink_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/reports-and-expenses/Suggested-Search" style={styles.link}>
                                    Suggested Search
                                </TextLink_1.default>
                            </Text_1.default>,
                        <Text_1.default style={styles.textNormal}>
                                <TextLink_1.default href="https://help.expensify.com/articles/new-expensify/reports-and-expenses/Search-and-Download-Expenses" style={styles.link}>
                                    Search and Download Expenses
                                </TextLink_1.default>
                            </Text_1.default>,
                    ]}/>
                </react_native_1.View>);
            },
        },
    },
    content: function () { return null; },
};
exports.default = helpContentMap;
