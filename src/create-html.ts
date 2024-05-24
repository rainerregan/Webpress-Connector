import { getComputedStyles, getTextStyles } from "./generate-styles";

const convertNodeToHtmlCss = async (node: SceneNode): Promise<string> => {
  if (!node) return ''
  let html = ''
  const elementId = node.id
  const styles = getComputedStyles(node)

  if (node.visible === false) return ''

  if (node?.type === 'TEXT') {
    let textSegmented = ''
    const segments = node.getStyledTextSegments(['fontName', 'fills', 'fontSize', 'fontWeight', 'textCase', 'textDecoration', 'letterSpacing', 'lineHeight']);
    segments.forEach(segment => {
      const text = (segment.characters).trim().replace(/\n/g, '<br>');

      const segmentStyle = getTextStyles(segment);

      textSegmented += `<span style="${segmentStyle}" id="${elementId}">${text}</span>`
    })
    html += textSegmented
  }

  if (node.type === 'FRAME') {
    const children = [...node.children]
    const childrenHtml = await Promise.all(children.map(async child => {
      return await convertNodeToHtmlCss(child)
    }))
    html += `<div style="${styles}" id="${elementId}">\n${childrenHtml.join('')}\n</div>`
  }

  // Create if node are rectangle
  if (node?.type === 'RECTANGLE') {
    html += `<div style="${styles}" id="${elementId}"></div>`
  }

  // If the node are group
  if (node?.type === 'GROUP') {
    const children = [...node.children]
    const childrenHtml = await Promise.all(children.map(async child => {
      return await convertNodeToHtmlCss(child)
    }))
    html += `<div style="${styles}" id="${elementId}">${childrenHtml}</div>`
  }

  // Create if node are component
  if (node?.type === 'INSTANCE') {
    // const frameNode = node.createInstance().detachInstance() as FrameNode
    const clone = node.clone()
    const detached = clone.detachInstance() as SceneNode
    const data = await convertNodeToHtmlCss(detached as SceneNode)
    html += `<div style="${styles}" id="${elementId}">${data}</div>`
  }

  // If the node is a vector, add the svg into the html
  if (node?.type === 'VECTOR') {
    const svg = await node.exportAsync({ format: 'SVG_STRING' })
    html += `<div style="${styles}" id="${elementId}">${svg}</div>`
  }

  return html
}

export const convertRootNodeToHtmlCss = async (nodes: SceneNode[]): Promise<string> => {
  let html = ''
  let css = ''

  const node = nodes[0]

  const generated = await convertNodeToHtmlCss(node)
  html += generated

  return `
    <body>
      ${html}
      <style>
        ${css}
      </style>
    </body>
  `
}