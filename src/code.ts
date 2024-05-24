import { convertRootNodeToHtmlCss } from "./create-html";

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-html-css') {
    try {
      const rootNodes = figma.currentPage.selection;
      console.log("Exported Node", rootNodes);
      
      if (rootNodes.length === 0) throw new Error('Please select a frame to export.');
      if (rootNodes.length > 1) throw new Error('Please select a frame one at a time.');

      const htmlCss = convertRootNodeToHtmlCss([...rootNodes]);
      figma.ui.postMessage({ type: 'html-css', content: htmlCss });
    } catch (error) {
      const err = error as Error;
      figma.notify(err.message);
      return
    }

  }
};
