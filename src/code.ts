import { convertRootNodeToHtmlCss } from "./create-html";
import { login, registerPlugin } from "./services/auth.service";

figma.showUI(__html__, {
  height: 400,
  width: 400
});

figma.ui.onmessage = async msg => {
  if (msg.type === 'login') {
    try {
      const content = msg.content as { email: string, password: string };
      if (!content.email || !content.password) throw new Error('Please enter email and password');
      const loginResponse = await login(content.email, content.password);
      console.log(loginResponse);

      figma.ui.postMessage({ type: 'login-success', content: loginResponse });
    } catch (error) {
      console.log(error);

      const err = error as Error;
      figma.notify(err.message);
      return
    }
  }

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

  if (msg.type === 'connect-plugin') {
    try {
      const content = msg.content as { email: string, password: string };
      const figmaUser = figma.currentUser;
      if (!content.email || !content.password) throw new Error('Please enter email and password');
      if (!figmaUser) throw new Error('Please login to figma');

      const response = await registerPlugin(content.email, content.password, figmaUser);
      const result = await response.json();
      if (!result) throw new Error('Failed to connect plugin');

      // Save user id to the client storage
      await figma.clientStorage.setAsync('userId', result.userId);

      figma.ui.postMessage({ type: 'plugin-connected', content: result });
    } catch (error) {

      const err = error as Error;
      console.log(err.message);
      figma.notify(err.message);
      return
    }
  }

  if (msg.type === 'get-saved-user') {
    try {
      const userId = await figma.clientStorage.getAsync('userId');
      console.log(userId);

      figma.ui.postMessage({ type: 'saved-user', content: userId });
    } catch (error) {
      console.log(error);
      const err = error as Error;
      figma.notify(err.message);
      return
    }
  }

  // Handle Logout
  if (msg.type === 'logout') {
    try {
      await figma.clientStorage.setAsync('userId', null);
      figma.ui.postMessage({ type: 'logout-success' });
    } catch (error) {
      console.log(error);
      const err = error as Error;
      figma.notify(err.message);
      return
    }
  }
};
