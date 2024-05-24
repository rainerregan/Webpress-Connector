// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

function convertNodeToHtmlCss(node: SceneNode): string {
  let html = '';
  let css = '';

  if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
    const styles = getComputedStyles(node);
    html = `<div style="${styles}"></div>`;
    css = `.class-${node.id} { ${styles} }`;
  }

  // Handle other node types (TEXT, GROUP, etc.) similarly

  return `${html}\n${css}`;
}

function getComputedStyles(node: SceneNode): string {
  let styles = '';

  if ('fills' in node) {
    const fill = (node.fills as readonly Paint[])[0];
    if (fill.type === 'SOLID') {
      styles += `background-color: rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.opacity}); `;
    }
  }

  if ('cornerRadius' in node) {
    styles += `border-radius: ${String(node.cornerRadius)}px; `;
  }

  // Add more style conversions as needed

  return styles;
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  console.log('Received message from UI:', msg);
  if (msg.type === 'generate-html-css') {
    const nodes = figma.currentPage.selection;
    console.log('Selected nodes:', nodes);
    const htmlCss = nodes.map(node => convertNodeToHtmlCss(node)).join('\n');
    console.log('Generated HTML & CSS:', htmlCss);
    figma.ui.postMessage({ type: 'html-css', content: htmlCss });
  }
};
