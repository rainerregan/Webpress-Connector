import { getComputedStyles } from "./generate-styles";

const convertNodeToHtmlCss = (node: SceneNode): string => {
  let html = ''
  const elementId = node.id
  const styles = getComputedStyles(node)

  if (node.type === 'TEXT') {
    const text = ((node as TextNode).characters).trim().replace(/\n/g, '<br>');
    html += `<p style="${styles}" id="${elementId}">${text}</p>`
  }

  if (node.type === 'FRAME') {
    const children = [...node.children]
    html += `<div style="${styles}" id="${elementId}">\n${children.map(child => convertNodeToHtmlCss(child)).join('')}\n</div>`
  }

  return html
}

export const convertRootNodeToHtmlCss = (nodes: SceneNode[]): string => {
  let html = ''
  let css = ''

  const node = nodes[0]

  const generated = convertNodeToHtmlCss(node)
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