
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOVIES_JSON_PATH = path.join(__dirname, '../src/data/movies.json');
const COMING_SOON_JSON_PATH = path.join(__dirname, '../src/data/coming_soon.json');
const HTML_PATH = path.join(__dirname, '../PREVIEW.html');

console.log(`Reading JSON from ${MOVIES_JSON_PATH}`);
const moviesData = fs.readFileSync(MOVIES_JSON_PATH, 'utf8');

console.log(`Reading Coming Soon JSON from ${COMING_SOON_JSON_PATH}`);
const comingSoonData = fs.readFileSync(COMING_SOON_JSON_PATH, 'utf8');

console.log(`Reading HTML from ${HTML_PATH}`);
let html = fs.readFileSync(HTML_PATH, 'utf8');

const variableDecl = `window.LOCAL_MOVIES = ${moviesData};\n    window.COMING_SOON_MOVIES = ${comingSoonData};`;
const inlineScript = `<script>${variableDecl}</script>`;

// Try to find the existing external script tag to replace
const tagsToReplace = [
    '<script src="./src/data/movies-data.js"></script>',
    '<script src="src/data/movies-data.js"></script>',
    // Also try to find a previous injection if any (unlikely if it didn't work)
];

let replaced = false;
for (const tag of tagsToReplace) {
    if (html.includes(tag)) {
        console.log(`Replacing tag: ${tag}`);
        html = html.replace(tag, inlineScript);
        replaced = true;
        break;
    }
}

if (!replaced) {
    console.log("Tag not found. Injecting before <div id=\"root\">");
    // Fallback: Inject before root div
    if (html.includes('<div id="root">')) {
        html = html.replace('<div id="root">', `${inlineScript}\n<div id="root">`);
        replaced = true;
    } else {
        console.error("Could not find insertion point!");
    }
}

if (replaced) {
    fs.writeFileSync(HTML_PATH, html);
    console.log(`Success! Wrote ${html.length} bytes to ${HTML_PATH}`);
} else {
    console.error("Failed to inject content.");
}
