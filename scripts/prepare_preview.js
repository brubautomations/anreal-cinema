
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '../src/data/movies.json');
const JS_OUTPUT_PATH = path.join(__dirname, '../src/data/movies-data.js');

if (fs.existsSync(JSON_PATH)) {
    const data = fs.readFileSync(JSON_PATH, 'utf8');
    // Sanitize slightly to avoid syntax errors in string
    const jsContent = `window.LOCAL_MOVIES = ${data};`;
    fs.writeFileSync(JS_OUTPUT_PATH, jsContent);
    console.log(`Created ${JS_OUTPUT_PATH}`);
} else {
    console.error(`Could not find ${JSON_PATH}`);
}
