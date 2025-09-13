"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const warnMessage = (platform) => `Number of hubs in _routes.yml does not match number of hubs in docs/${platform}/articles. Please update _routes.yml with hub info.`;
const disclaimer = '# This file is auto-generated. Do not edit it directly. Use npm run createDocsRoutes instead.\n';
const docsDir = `${process.cwd()}/docs`;
const routes = js_yaml_1.default.load(fs_1.default.readFileSync(`${docsDir}/_data/_routes.yml`, 'utf8'));
const platformNames = {
    expensifyClassic: 'expensify-classic',
    newExpensify: 'new-expensify',
    travel: 'travel',
};
/**
 * @param str - The string to convert to title case
 */
function toTitleCase(str) {
    return str
        .split(' ')
        .map((word, index) => {
        if (index !== 0 && (word.toLowerCase() === 'a' || word.toLowerCase() === 'the' || word.toLowerCase() === 'and')) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.substring(1);
    })
        .join(' ');
}
/**
 * @param filename - The name of the file
 */
function getArticleObj(filename, order) {
    const href = filename.replace('.md', '');
    return {
        href,
        title: toTitleCase(href.replaceAll('-', ' ')),
        order,
    };
}
/**
 * If the article / sections exist in the hub, then push the entry to the array.
 * Otherwise, create the array and push the entry to it.
 * @param hubs - The hubs array
 * @param hub - The hub we are iterating
 * @param key - If we want to push sections / articles
 * @param entry - The article / section to push
 */
function pushOrCreateEntry(hubs, hub, key, entry) {
    const hubObj = hubs.find((obj) => obj.href === hub);
    if (!hubObj) {
        return;
    }
    if (hubObj[key]) {
        hubObj[key]?.push(entry);
    }
    else {
        hubObj[key] = [entry];
    }
}
function getOrderFromArticleFrontMatter(path) {
    const frontmatter = fs_1.default.readFileSync(path, 'utf8').split('---').at(1);
    if (!frontmatter) {
        return;
    }
    const frontmatterObject = js_yaml_1.default.load(frontmatter);
    return frontmatterObject.order;
}
/**
 * Add articles and sections to hubs
 * @param hubs - The hubs inside docs/articles/ for a platform
 * @param platformName - Expensify Classic or New Expensify
 * @param routeHubs - The hubs insude docs/data/_routes.yml for a platform
 */
function createHubsWithArticles(hubs, platformName, routeHubs) {
    hubs.forEach((hub) => {
        // Iterate through each directory in articles
        fs_1.default.readdirSync(`${docsDir}/articles/${platformName}/${hub}`).forEach((fileOrFolder) => {
            // If the directory content is a markdown file, then it is an article
            if (fileOrFolder.endsWith('.md')) {
                const articleObj = getArticleObj(fileOrFolder);
                pushOrCreateEntry(routeHubs, hub, 'articles', articleObj);
                return;
            }
            // For readability, we will use the term section to refer to subfolders
            const section = fileOrFolder;
            const articles = [];
            // Each subfolder will be a section containing articles
            fs_1.default.readdirSync(`${docsDir}/articles/${platformName}/${hub}/${section}`).forEach((subArticle) => {
                const order = getOrderFromArticleFrontMatter(`${docsDir}/articles/${platformName}/${hub}/${section}/${subArticle}`);
                articles.push(getArticleObj(subArticle, order));
            });
            pushOrCreateEntry(routeHubs, hub, 'sections', {
                href: section,
                title: toTitleCase(section.replaceAll('-', ' ')),
                articles,
            });
        });
    });
}
function run() {
    const expensifyClassicArticleHubs = fs_1.default.readdirSync(`${docsDir}/articles/${platformNames.expensifyClassic}`);
    const newExpensifyArticleHubs = fs_1.default.readdirSync(`${docsDir}/articles/${platformNames.newExpensify}`);
    const travelArticleHubs = fs_1.default.readdirSync(`${docsDir}/articles/${platformNames.travel}`);
    const expensifyClassicRoute = routes.platforms.find((platform) => platform.href === platformNames.expensifyClassic);
    const newExpensifyRoute = routes.platforms.find((platform) => platform.href === platformNames.newExpensify);
    const travelRoute = routes.platforms.find((platform) => platform.href === platformNames.travel);
    if (expensifyClassicArticleHubs.length !== expensifyClassicRoute?.hubs.length) {
        console.error(warnMessage(platformNames.expensifyClassic));
        process.exit(1);
    }
    if (newExpensifyArticleHubs.length !== newExpensifyRoute?.hubs.length) {
        console.error(warnMessage(platformNames.newExpensify));
        process.exit(1);
    }
    if (travelArticleHubs.length !== travelRoute?.hubs.length) {
        console.error(warnMessage(platformNames.travel));
        process.exit(1);
    }
    createHubsWithArticles(expensifyClassicArticleHubs, platformNames.expensifyClassic, expensifyClassicRoute.hubs);
    createHubsWithArticles(newExpensifyArticleHubs, platformNames.newExpensify, newExpensifyRoute.hubs);
    createHubsWithArticles(travelArticleHubs, platformNames.travel, travelRoute.hubs);
    // Convert the object to YAML and write it to the file
    let yamlString = js_yaml_1.default.dump(routes);
    yamlString = disclaimer + yamlString;
    fs_1.default.writeFileSync(`${docsDir}/_data/routes.yml`, yamlString);
}
try {
    run();
}
catch (error) {
    console.error('A problem occurred while trying to read the directories.', error);
    process.exit(1);
}
