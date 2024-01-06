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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rss_to_json_1 = require("rss-to-json");
const html_to_json_parser_1 = require("html-to-json-parser");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const fs_1 = require("fs");
const userName = "oliver.n.winfield"; //"benjamin.Mizrany";
const rssUrl = `https://medium.com/@${userName}/feed`;
const article = 0;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rss = yield (0, rss_to_json_1.parse)(rssUrl);
        console.log(`${rss.items[article].title}`);
        let htmlContent = `<div>${rss.items[article].content}</div>`;
        // Sanitize HTML content
        htmlContent = (0, sanitize_html_1.default)(htmlContent, {
            allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img', 'figure']),
            allowedAttributes: false,
        });
        const result = yield (0, html_to_json_parser_1.HTMLToJSON)(htmlContent, true);
        let jsonObject;
        if (typeof result === 'string') {
            jsonObject = JSON.parse(result); // Convert string to JSON object
        }
        else {
            jsonObject = result; // Already a JSON object
        }
        rss.items[article].content = jsonObject;
        // Save to a JSON file
        const fileName = 'articleContent.json';
        (0, fs_1.writeFileSync)(fileName, JSON.stringify(rss.items[article], null, 3));
        console.log(`Content saved to ${fileName}`);
    }
    catch (error) {
        console.error('Error:', error);
    }
}))();
