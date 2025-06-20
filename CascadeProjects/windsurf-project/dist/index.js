"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const marked_1 = require("marked");
const path_1 = require("path");
const SOURCE_DIR = 'server';
const OUTPUT_FILE = 'data.json';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield (0, promises_1.readdir)(SOURCE_DIR);
            const mdFiles = files.filter(file => (0, path_1.extname)(file).toLowerCase() === '.md');
            const jsonData = yield Promise.all(mdFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                const filePath = (0, path_1.join)(SOURCE_DIR, file);
                const mdContent = yield (0, promises_1.readFile)(filePath, 'utf8');
                const lines = mdContent.split('\n');
                const title = (0, path_1.basename)(file, (0, path_1.extname)(file));
                const tags = lines[0].split('#').map(tag => tag.trim()).filter(Boolean);
                let stars = 0;
                let watchedDate = null;
                let contentStartIndex = 1;
                // Find the end of metadata
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    let isMetadata = false;
                    if (line.includes('⭐')) {
                        const starMatch = line.match(/⭐/g);
                        stars = starMatch ? starMatch.length : 0;
                        isMetadata = true;
                    }
                    const dateRegex = /(\d{2} de \w+ de \d{4})/;
                    if (dateRegex.test(line)) {
                        const dateMatch = line.match(dateRegex);
                        watchedDate = dateMatch ? dateMatch[1] : null;
                        isMetadata = true;
                    }
                    if (!isMetadata && line.trim() !== '') {
                        contentStartIndex = i;
                        break;
                    }
                    if (isMetadata) {
                        contentStartIndex = i + 1;
                    }
                }
                const reviewContent = lines.slice(contentStartIndex).join('\n').trim();
                const review = (0, marked_1.marked)(reviewContent);
                return {
                    title,
                    tags,
                    stars,
                    watchedDate,
                    review,
                };
            })));
            yield (0, promises_1.writeFile)(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
            console.log(`Successfully converted ${mdFiles.length} files to ${OUTPUT_FILE}`);
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
