export const updateProjectData = async (exportData: ExportProjectData) => {
  if (!exportData.userId) throw new Error('User is undefined');
  if (!exportData.projectId) throw new Error('Project is undefined');
  if (!exportData.figmaUserId) throw new Error('Figma user is undefined');
  if (!exportData.htmlCss) throw new Error('HTML & CSS is undefined');

  const { userId, projectId, figmaUserId, htmlCss } = exportData;

  const API_URL = process.env.API_URL;
  const bodyData = JSON.stringify({
    user_id: userId,
    figma_id: figmaUserId,
    website_content: htmlCss,
    project_id: projectId
  });

  const response = await fetch(`${API_URL}/plugin/export-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
    },
    body: bodyData
  })

  return response;
}