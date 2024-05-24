import { convertRootNodeToHtmlCss } from "./create-html";

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-html-css') {
    try {
      const rootNodes = figma.currentPage.selection;
      if (rootNodes.length === 0) throw new Error('Please select a frame to export.');

      const htmlCss = convertRootNodeToHtmlCss([...rootNodes]);
      figma.ui.postMessage({ type: 'html-css', content: htmlCss });
    } catch (error) {
      const err = error as Error;
      figma.notify(err.message);
      return
    }

  }
};
