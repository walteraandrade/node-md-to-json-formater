import { readdir, readFile, writeFile } from 'fs/promises';
import { marked } from 'marked';
import { join, extname, basename } from 'path';

const SOURCE_DIR = 'server';
const OUTPUT_FILE = 'data.json';

async function main() {
  try {
    const files = await readdir(SOURCE_DIR);
    const mdFiles = files.filter(file => extname(file).toLowerCase() === '.md');

    const jsonData = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = join(SOURCE_DIR, file);
        const mdContent = await readFile(filePath, 'utf8');
        const lines = mdContent.split('\n');

        const title = basename(file, extname(file));
        const tags = lines[0].split('#').map(tag => tag.trim()).filter(Boolean);
        
        let stars = 0;
        let watchedDate: string | null = null;
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
        const review = marked(reviewContent);

        return {
          title,
          tags,
          stars,
          watchedDate,
          review,
        };
      })
    );

    await writeFile(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`Successfully converted ${mdFiles.length} files to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
