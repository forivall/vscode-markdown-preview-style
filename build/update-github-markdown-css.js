'use strict';

var path = require('path');
var fs = require('fs');

const inputPath = path.join('node_modules', 'github-markdown-css', 'github-markdown.css');
const fullPath = path.join(__dirname, '..', inputPath);


/** @param {string} input */
function updateGithubMarkdownCss(input) {
    return (
        `/* Generated from '${inputPath}' */\n` +
        input
            .replace(/\.markdown-body/g, ".vscode-body")
            .replace(/font-size: (\d+)px(\s*(?:!important)?;?)/g, (match, px, semi) =>
                px === "16" ? `/* font-size: 1em${semi} */` : `font-size: ${Number(px) / 16}em${semi}`
            )
    );
} 


const input = fs.readFileSync(fullPath, 'utf8');

fs.writeFileSync(
    path.join(__dirname, '..', 'github-markdown.css'),
    updateGithubMarkdownCss(input));
