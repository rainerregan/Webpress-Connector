import { getColorString, rgbToHex } from "./color-utils";

function getGeneralStyles(node: SceneNode): string {
  let styles = '';

  if ('opacity' in node) {
    styles += `opacity: ${String(node.opacity)}; `;
  }

  //  If parent is not null, Add absolute position if parent is a frame and is not on layoutMode
  if (node.parent !== null) {
    const parent = node.parent as FrameNode;
    if (parent.type === 'FRAME' && parent.layoutMode === 'NONE') {
      styles += `position: absolute; `;

      // Add top and left position if parent is not on layoutMode
      if ('x' in node) {
        styles += `left: ${String(node.x)}px; `;
      }
      if ('y' in node) {
        styles += `top: ${String(node.y)}px; `;
      }
    }
  }

  return styles;
}

function getFrameStyles(node: FrameNode): string {
  let styles = '';

  if ('fills' in node) {
    const fill = (node.fills as Paint[])[0];
    if (fill.type === 'SOLID') {
      const opacity = fill.opacity !== undefined ? fill.opacity : 1;
      styles += `background-color: ${rgbToHex(fill.color)}; `;
    }
  }

  if ('cornerRadius' in node) {
    styles += `border-radius: ${String(node.cornerRadius)}px; `;
  }

  if ('height' in node) {
    styles += `height: ${String(node.height)}px; `;
  }

  if ('width' in node) {
    styles += `width: ${String(node.width)}px; `;
  }

  if ('clipsContent' in node) {
    styles += `overflow: hidden; `;
  }

  if ('layoutMode' in node) {
    const layoutMode = node.layoutMode;
    if (layoutMode === 'HORIZONTAL') {
      styles += `flex-direction: row; `;
    } else if (layoutMode === 'VERTICAL') {
      styles += `flex-direction: column; `;
    } else if (layoutMode === 'NONE') {
      styles += `position: relative; `;
    }
  }

  return styles;
}

function getTextStyles(node: TextNode): string {
  let styles = '';

  if ('fontSize' in node) {
    styles += `font-size: ${String(node.fontSize)}px; `;
  }

  if ('fontName' in node) {
    const fontName = node.fontName as FontName;
    styles += `font-family: ${fontName.family}; `;
  }

  if ('characters' in node) {
    styles += `color: ${getColorString((node.fills as Paint[])[0])}; `;
  }

  return styles;
}

export function getComputedStyles(node: SceneNode): string {
  let styles = '';

  // Specific Styles
  switch (node.type) {
    case 'TEXT':
      styles += getTextStyles(node as TextNode);
      break;
    case 'FRAME':
      styles += getFrameStyles(node as FrameNode);
      break;
  }

  // TODO: General Styles
  styles += getGeneralStyles(node);

  // TODO: Add more style conversions as needed

  return styles;
}