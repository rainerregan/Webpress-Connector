import { generateColor, getColorString, rgbToHex } from "./color-utils";

function getGeneralStyles(node: SceneNode): string {
  if (!node) return ''

  let styles = '';

  // Add color
  if ('fills' in node) {
    styles += getFillStyles(node);
  }

  if ('opacity' in node) {
    styles += `opacity: ${String(node.opacity)}; `;
  }

  // Add border
  if ('strokes' in node) {
    const stroke = (node.strokes as Paint[])[0];
    if (stroke && stroke.type === 'SOLID') {
      styles += `border: 1px solid ${rgbToHex(stroke.color)}; `;
    }
  }

  if ('cornerRadius' in node) {
    node = node as RectangleNode;
    styles += `border-radius: ${String(node.cornerRadius)}px; `;

    // If corner radius type is figma.mixed, add border radius for each corner
    if (node.cornerRadius === figma.mixed) {
      if (node.topLeftRadius !== undefined) {
        styles += `border-top-left-radius: ${String(node.topLeftRadius)}px; `;
      }
      if (node.topRightRadius !== undefined) {
        styles += `border-top-right-radius: ${String(node.topRightRadius)}px; `;
      }
      if (node.bottomRightRadius !== undefined) {
        styles += `border-bottom-right-radius: ${String(node.bottomRightRadius)}px; `;
      }
      if (node.bottomLeftRadius !== undefined) {
        styles += `border-bottom-left-radius: ${String(node.bottomLeftRadius)}px; `;
      }
    }
  }

  // If the layoutSizingHorizontal is HUG, add width of fit content
  if ('layoutSizingHorizontal' in node && node.layoutSizingHorizontal === 'HUG') {
    styles += `width: fit-content; `;
  } else if ('layoutSizingHorizontal' in node && node.layoutSizingHorizontal === 'FIXED') {
    if ('width' in node) {
      styles += `width: ${String(node.width)}px; `;
    }
  } else if ('layoutSizingHorizontal' in node && node.layoutSizingHorizontal === 'FILL') {
    // Add width of 100% if the layoutSizingHorizontal is FILL
    styles += `width: 100%; `;
  }

  // If the layoutSizingVertical is HUG, add height of fit content
  if ('layoutSizingVertical' in node && node.layoutSizingVertical === 'HUG') {
    styles += `height: fit-content; `;
  } else if ('layoutSizingVertical' in node && node.layoutSizingVertical === 'FIXED') {
    if ('height' in node) {
      styles += `height: ${String(node.height)}px; `;
    }
  } else if ('layoutSizingVertical' in node && node.layoutSizingVertical === 'FILL') {
    // Add height of 100% if the layoutSizingVertical is FILL
    styles += `height: 100%; `;
  }

  //  If parent is not null, Add absolute position if parent is a frame and is not on layoutMode
  if (node.parent !== null && node.parent.type === 'FRAME') {
    const parent = node.parent as FrameNode;

    // Add absolute position if parent is a frame and is not on layoutMode
    if (parent.layoutMode === 'NONE') {
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

function getFillStyles(node: SceneNode): string {
  let styles = '';

  // If the node type is rectangle and frame, add background color, if the node type is text, add color
  if (node.type === 'RECTANGLE' || node.type === 'FRAME') {
    const fill = (node.fills as Paint[])[0];

    if (fill && fill.type === 'SOLID') {
      const opacity = fill.opacity !== undefined ? fill.opacity : 1;
      styles += `background-color: ${generateColor(fill.color, opacity)}; `;
    }
  }

  return styles;
}

function getFrameStyles(node: FrameNode): string {
  let styles = '';

  if ('clipsContent' in node) {
    styles += `overflow: hidden; `;
  }
  // If the layout node is none, add relative position
  if ('layoutMode' in node && node.layoutMode === 'NONE') {
    styles += `position: relative; `;
  }

  // If node is a frame and is on layoutMode, and inferredAutoLayout is true, add flex, and the alignments
  if (node.layoutMode !== 'NONE') {
    styles += `display: flex; `;

    // Add gap
    if (node.inferredAutoLayout?.itemSpacing !== undefined) {
      styles += `gap: ${String(node.itemSpacing)}px; `;
    }

    // Add Paddings
    if (node.paddingTop !== undefined) {
      styles += `padding-top: ${String(node.paddingTop)}px; `;
    }
    if (node.paddingRight !== undefined) {
      styles += `padding-right: ${String(node.paddingRight)}px; `;
    }
    if (node.paddingBottom !== undefined) {
      styles += `padding-bottom: ${String(node.paddingBottom)}px; `;
    }
    if (node.paddingLeft !== undefined) {
      styles += `padding-left: ${String(node.paddingLeft)}px; `;
    }

    // Add flex direction
    if (node.layoutMode === 'HORIZONTAL') {
      styles += `flex-direction: row; `;
    } else if (node.layoutMode === 'VERTICAL') {
      styles += `flex-direction: column; `;
    }

    // Add alignments using switch case
    switch (node.primaryAxisAlignItems) {
      case 'MIN':
        styles += `justify-content: flex-start; `;
        break;
      case 'CENTER':
        styles += `justify-content: center; `;
        break;
      case 'MAX':
        styles += `justify-content: flex-end; `;
        break;
      case 'SPACE_BETWEEN':
        styles += `justify-content: space-between; `;
    }

    // Add alignments using switch case
    switch (node.counterAxisAlignItems) {
      case 'MIN':
        styles += `align-items: flex-start; `;
        break;
      case 'CENTER':
        styles += `align-items: center; `;
        break;
      case 'MAX':
        styles += `align-items: flex-end; `;
        break;
      case "BASELINE":
        styles += `align-items: baseline; `;
        break;
    }
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

export function getTextStyles(node: Partial<TextNode>): string {
  let styles = '';

  if ('fontSize' in node) {
    styles += `font-size: ${String(node.fontSize)}px; `;
  }

  if ('fontName' in node) {
    const fontName = node.fontName as FontName;
    styles += `font-family: ${fontName.family}; `;
  }

  // Add font weight
  if ('fontWeight' in node) {
    styles += `font-weight: ${String(node.fontWeight)}; `;
  }

  // Add line height
  if ('lineHeight' in node) {
    styles += `line-height: ${String(node.lineHeight)}px; `;
  }

  if ('characters' in node) {
    // Add color if the fill is not figma.mixed
    const fills = node.fills as Paint[]
    const fill = fills[0];
    if(fill) styles += `color: ${getColorString(fills[0])}; `;
  }

  return styles;
}

const getGroupStyles = (node: GroupNode): string => {
  let styles = '';

  // Add position relative to the node
  styles += `position: relative; `;

  // For each child, add position absolute, and add top and left position
  node.children.forEach(child => {
    styles += `#${child.id} { position: absolute; top: ${child.y}px; left: ${child.x}px; } `;
  });

  return styles;
}

export function getComputedStyles(node: SceneNode): string {

  let styles = '';
  if (node.type === undefined) return ''

  // TODO: General Styles
  styles += getGeneralStyles(node);

  console.log("Node Style", node.type);
  // Specific Styles
  switch (node.type) {
    case 'TEXT':
      styles += getTextStyles(node as TextNode);
      break;
    case 'FRAME':
      styles += getFrameStyles(node as FrameNode);
      break;
    case 'GROUP':
      styles += getGroupStyles(node as GroupNode);
      break;
  }

  // TODO: Add more style conversions as needed

  return styles;
}