#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const generateDarkCss = require('generate-github-markdown-css-dark');

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

main();
async function main() {
    const input = fs.readFileSync(fullPath, 'utf8');

    fs.writeFileSync(
        path.join(__dirname, '..', 'github-markdown.css'),
        updateGithubMarkdownCss(input));

    const darkStyle = process.argv[2] || 'https://github.com/DarkThemeHub/GithubDarkTheme/raw/master/Generated/github.user.styl';

    const darkInput = await generateDarkCss({ darkStyle });

    // other fixes needed, generally to pull the styles applied to the body:
    // https://github.com/StylishThemes/GitHub-Dark/raw/master/github-dark.user.css
    // https://github.com/neyasbltb88/github-dark-theme/raw/master/style.css
    // https://github.com/cquanu/github-dark/raw/master/github-dark.user.css

    // TODO: these fixups should be in base.css instead
    const extra = darkStyle.includes('DarkThemeHub/GithubDarkTheme') ? `
html {
  background-color: #222 !important;
}
.vscode-body {
  background: #25272a !important;
}
` : ''

    fs.writeFileSync(
        path.join(__dirname, '..', 'github-markdown-dark.css'),
        updateGithubMarkdownCss(darkInput) + extra);
}
