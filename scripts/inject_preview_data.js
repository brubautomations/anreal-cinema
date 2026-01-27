
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '../src/data/movies.json');
const HTML_PATH = path.join(__dirname, '../PREVIEW.html');

if (fs.existsSync(JSON_PATH) && fs.existsSync(HTML_PATH)) {
    const jsonData = fs.readFileSync(JSON_PATH, 'utf8');
    let htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

    // Replace the external script tag with inline data
    // OR just prepend it if the tag is missing, but we know it's there from previous step
    const targetTag = '<script src="./src/data/movies-data.js"></script>';
    const replacement = `<script>window.LOCAL_MOVIES = ${jsonData};</script>`;

    if (htmlContent.includes(targetTag)) {
        htmlContent = htmlContent.replace(targetTag, replacement);
        fs.writeFileSync(HTML_PATH, htmlContent);
        console.log(`Success: Injected data into PREVIEW.html`);
    } else {
        console.error(`Target tag not found in PREVIEW.html. Content start: ${htmlContent.substring(0, 100)}`);
    }
} else {
    console.error(`Missing files: JSON=${fs.existsSync(JSON_PATH)}, HTML=${fs.existsSync(HTML_PATH)}`);
}
