import { convertRootNodeToHtmlCss } from "./create-html";
import { login } from "./services/auth.service";

figma.showUI(__html__, {
  height: 400,
  width: 400
});

figma.ui.onmessage = async msg => {
  // if (msg.type === 'login') {
  //   try {
  //     figma.showUI('<iframe src="https://webpress.id" width="100%" height="100%"></iframe>', {
  //       width: 700,
  //       height: 600
  //     })
  //     // const content = msg.content as { email: string, password: string };
  //     // if (!content.email || !content.password) throw new Error('Please enter email and password');
  //     // const loginResponse = await login(content.email, content.password);
  //     // console.log(loginResponse);
      
  //     // figma.ui.postMessage({ type: 'login-success', content: loginResponse });
  //   } catch (error) {
  //     console.log(error);

  //     const err = error as Error;
  //     figma.notify(err.message);
  //     return
  //   }
  // }

  if (msg.type === 'generate-html-css') {
    try {
      const rootNodes = figma.currentPage.selection;
      console.log("Exported Node", rootNodes);

      if (rootNodes.length === 0) throw new Error('Please select a frame to export.');
      if (rootNodes.length > 1) throw new Error('Please select a frame one at a time.');

      const htmlCss = await convertRootNodeToHtmlCss([...rootNodes]);
      figma.ui.postMessage({ type: 'html-css', content: htmlCss });
    } catch (error) {
      console.log(error);

      const err = error as Error;
      figma.notify(err.message);
      return
    }

  }
};
