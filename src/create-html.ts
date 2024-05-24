export const convertNodeToHtmlCss = (nodes: SceneNode[]): string => {
  let html = ''
  let css = ''

  return `
    <body>
      ${html}
      <style>
        ${css}
      </style>
    </body>
  `
}