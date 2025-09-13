"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectReactComponent = detectReactComponent;
const github = require("@actions/github");
const parser_1 = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const promiseSome_1 = require("@github/libs/promiseSome");
const items = [
    "I verified that similar component doesn't exist in the codebase",
    'I verified that all props are defined accurately and each prop has a `/** comment above it */`',
    'I verified that each file is named correctly',
    'I verified that each component has a clear name that is non-ambiguous and the purpose of the component can be inferred from the name alone',
    'I verified that the only data being stored in component state is data necessary for rendering and nothing else',
    "In component if we are not using the full Onyx data that we loaded, I've added the proper selector in order to ensure the component only re-renders when the data it is using changes",
    'For Class Components, any internal methods passed to components event handlers are bound to `this` properly so there are no scoping issues (i.e. for `onClick={this.submit}` the method `this.submit` should be bound to `this` in the constructor)',
    'I verified that component internal methods bound to `this` are necessary to be bound (i.e. avoid `this.submit = this.submit.bind(this);` if `this.submit` is never passed to a component event handler like `onClick`)',
    'I verified that all JSX used for rendering exists in the render method',
    'I verified that each component has the minimum amount of code necessary for its purpose, and it is broken down into smaller components in order to separate concerns and functions',
];
function isComponentOrPureComponent(name) {
    return name === 'Component' || name === 'PureComponent';
}
function detectReactComponent(code, filename) {
    if (!code) {
        console.error('failed to get code from a filename', code, filename);
        return;
    }
    const ast = (0, parser_1.parse)(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'], // enable jsx plugin
    });
    let isReactComponent = false;
    (0, traverse_1.default)(ast, {
        enter(path) {
            if (isReactComponent) {
                return;
            }
            if (path.isFunctionDeclaration() || path.isArrowFunctionExpression() || path.isFunctionExpression()) {
                path.traverse({
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    JSXElement() {
                        isReactComponent = true;
                        path.stop();
                    },
                });
            }
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ClassDeclaration(path) {
            const { superClass } = path.node;
            if (superClass &&
                ((superClass.object && superClass.object.name === 'React' && isComponentOrPureComponent(superClass.property.name)) || isComponentOrPureComponent(superClass.name))) {
                isReactComponent = true;
                path.stop();
            }
        },
    });
    return isReactComponent;
}
function nodeBase64ToUtf8(data) {
    return Buffer.from(data, 'base64').toString('utf-8');
}
async function detectReactComponentInFile(filename) {
    const params = {
        owner: CONST_1.default.GITHUB_OWNER,
        repo: CONST_1.default.APP_REPO,
        path: filename,
        ref: github.context.payload?.pull_request?.head.ref,
    };
    try {
        const { data } = await GithubUtils_1.default.octokit.repos.getContent(params);
        const content = nodeBase64ToUtf8('content' in data ? (data?.content ?? '') : '');
        return detectReactComponent(content, filename);
    }
    catch (error) {
        console.error('An unknown error occurred with the GitHub API: ', error, params);
    }
}
async function detect(changedFiles) {
    const filteredFiles = changedFiles.filter(({ filename, status }) => status === 'added' && (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx')));
    try {
        await (0, promiseSome_1.default)(filteredFiles.map(({ filename }) => detectReactComponentInFile(filename)), (result) => !!result);
        return true;
    }
    catch (err) {
        return false;
    }
}
const newComponentCategory = {
    detect,
    items,
};
exports.default = newComponentCategory;
