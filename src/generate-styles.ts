import { getColorString, rgbToHex } from "./color-utils";

function getFrameStyles(node: FrameNode): string {
  let styles = '';

  if ('fills' in node) {
    const fill = (node.fills as Paint[])[0];
    if (fill.type === 'SOLID') {
      const opacity = fill.opacity !== undefined ? fill.opacity : 1;
      console.log(rgbToHex(fill.color));

      styles += `background-color: ${rgbToHex(fill.color)}; `;
    }
  }

  if ('cornerRadius' in node) {
    styles += `border-radius: ${String(node.cornerRadius)}px; `;
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

  // TODO: Add more style conversions as needed

  return styles;
}