// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

import { convertNodeToHtmlCss } from "./create-html";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// function convertNodeToHtmlCss(node: SceneNode): string {
//   let html = '';
//   let css = '';

//   console.log(node);

//   // Create Frame Node to HTML
//   if(node.type === 'FRAME') {

//   }


//   if (node.type === 'FRAME' || node.type === 'GROUP') {
//     html += `<div style="${getComputedStyles(node)}">\n`;
//     node.children.forEach(child => {
//       const childHtmlCss = convertNodeToHtmlCss(child);
//       html += indentHtml(childHtmlCss);
//     });
//     html += `</div>\n`;
//   } else if (node.type === 'RECTANGLE') {
//     const styles = getComputedStyles(node);
//     html = `<div style="${styles}"></div>\n`;
//     css = `.class-${node.id} { ${styles} }`;
//   } else if (node.type === 'TEXT') {
//     const styles = getComputedStyles(node);
//     const text = (node as TextNode).characters;
//     html = `<div style="${styles}">${text}</div>\n`;
//     css = `.class-${node.id} { ${styles} }`;
//   }

//   // Handle other node types (ELLIPSE, POLYGON, etc.) similarly

//   return `${html}${css}`;
// }

// function getColorString(paint: Paint): string {
//   if (paint.type === 'SOLID') {
//     const color = paint.color;
//     const opacity = paint.opacity !== undefined ? paint.opacity : 1;
//     return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`;
//   }
//   return '';
// }

// function getComputedStyles(node: SceneNode): string {
//   let styles = '';

//   if ('fills' in node) {
//     const fill = (node.fills as Paint[])[0];
//     if (fill.type === 'SOLID') {
//       const opacity = fill.opacity !== undefined ? fill.opacity : 1;
//       styles += `background-color: rgba(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)}, ${opacity}); `;
//     }
//   }

//   if ('cornerRadius' in node) {
//     styles += `border-radius: ${String(node.cornerRadius)}px; `;
//   }

//   if ('fontSize' in node) {
//     styles += `font-size: ${String((node as TextNode).fontSize)}px; `;
//   }

//   if ('fontName' in node) {
//     const fontName = (node as TextNode).fontName as FontName;
//     styles += `font-family: ${fontName.family}; `;
//   }

//   if ('characters' in node) {
//     styles += `color: ${getColorString(((node as TextNode).fills as Paint[])[0])}; `;
//   }

//   // Add more style conversions as needed

//   return styles;
// }

// function indentHtml(html: string): string {
//   return html.split('\n').map(line => '  ' + line).join('\n');
// }

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-html-css') {
    console.log('Generating HTML and CSS');

    const nodes = figma.currentPage.selection;
    if (nodes.length === 0) {
      figma.notify('Please select a frame to export.');
      return;
    }

    const c = nodes.map(node => node);
    const htmlCss = convertNodeToHtmlCss(c);
    figma.ui.postMessage({ type: 'html-css', content: htmlCss });
  }
};
