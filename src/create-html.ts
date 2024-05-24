const convertNodeToHtmlCss = (node: SceneNode): string => {
  return ''
}

export const convertRootNodeToHtmlCss = (nodes: SceneNode[]): string => {
  let html = ''
  let css = ''

  nodes.map(node => {
    const nodeHtmlCss = convertNodeToHtmlCss(node)
  })

  console.log('Nodes:', nodes);

  return `
    <body>
      ${html}
      <style>
        ${css}
      </style>
    </body>
  `
}