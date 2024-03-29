

import { parse } from 'rss-to-json';
import { HTMLToJSON } from 'html-to-json-parser';
import sanitizeHtml from 'sanitize-html';
import { writeFileSync } from 'fs';

const userName = "oliver.n.winfield"//"benjamin.Mizrany";
const rssUrl = `https://medium.com/@${userName}/feed`;
const article = 0;

(async () => {
    try {
        const rss = await parse(rssUrl);
        console.log(`${rss.items[article].title}`);
        let htmlContent = `<div>${rss.items[article].content}</div>`;

        // Sanitize HTML content
        htmlContent = sanitizeHtml(htmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure']),
            allowedAttributes: false,
        });

        const result = await HTMLToJSON(htmlContent, true);
        let jsonObject;
        
        if (typeof result === 'string') {
            jsonObject = JSON.parse(result); // Convert string to JSON object
        } else {
            jsonObject = result; // Already a JSON object
        }

        rss.items[article].content = jsonObject; 

        // Save to a JSON file
        const fileName = 'articleContent.json';
        writeFileSync(fileName, JSON.stringify(rss.items[article], null, 3));
        console.log(`Content saved to ${fileName}`);

    } catch (error) {
        console.error('Error:', error);
    }
})();
