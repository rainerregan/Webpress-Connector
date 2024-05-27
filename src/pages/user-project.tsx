import React, { useEffect, useState } from 'react'
import { ComponentProps, PageSelection } from '../App'
import Button, { ButtonType } from '../components/button';
import ProjectCard from '../components/project-card';
import { updateProjectData } from '../services/project.service';

const UserProject: React.FC<ComponentProps> = (props) => {
  const [selectedProject, setSelectedProject] = useState<UserProjectMetadata | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProjectHtmlCss, setSelectedProjectHtmlCss] = useState<string | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const logout = () => {
    parent.postMessage({ pluginMessage: { type: 'logout' } }, '*');
  }

  const handleSelect = (project: UserProjectMetadata) => {
    setSelectedProject(project)
  }

  const handleExport = () => {
    if (!selectedProject) return
    setIsLoading(true)
    setErrorMessage(undefined)
    parent.postMessage({ pluginMessage: { type: 'generate-html-css' } }, '*');
  }

  const handleUpdateData = async () => {
    try {
      if (!selectedProjectHtmlCss) throw new Error('Failed to generate HTML & CSS')
      if (!props.loggedUser) throw new Error('User not found')
      if (!selectedProject) throw new Error('Project not found')
      if (!props.currentFigmaUser?.id) throw new Error('Figma user not found')

      const data: ExportProjectData = {
        userId: props.loggedUser.userId,
        projectId: selectedProject.id,
        figmaUserId: props.currentFigmaUser.id,
        htmlCss: selectedProjectHtmlCss
      }

      const response = await updateProjectData(data)
      const responseJSON = await response.json()

      if (!responseJSON) throw new Error('Failed to update project data')

      // Update is success
      props.setExportedProjectId && props.setExportedProjectId(selectedProject.id)
      props.setPageSelection(PageSelection.DONE)
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message ?? "Terjadi error dalam mengupdate data project");
    }
  }

  useEffect(() => {
    if (selectedProjectHtmlCss) {
      handleUpdateData()
    }
  }, [selectedProjectHtmlCss])


  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      if (type === 'logout-success') {
        props.setLoggedUser(null)
        props.setUserProjectList([])
      }

      if (type === 'html-css') {
        setIsLoading(false)
        if (!content) {
          setSelectedProjectHtmlCss(undefined)
          return
        }
        setSelectedProjectHtmlCss(content)
      }
    };
  }, []);

  return (
    <div>
      <div>
        <h1 className='text-2xl font-semibold'>Projects</h1>
        <p className='text-xs text-gray-400'>Pilih project web yang ingin anda hubungkan.</p>
      </div>
      <div className='py-4'>
        {props.userProjectList?.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            handleSelect={handleSelect}
            selected={selectedProject?.id === project.id}
          />
        ))}
      </div>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <div className='flex flex-col gap-2'>
        <Button onClick={handleExport} disabled={!selectedProject || isLoading}>
          {isLoading ? 'Loading...' : 'Export Project'}
        </Button>
        <Button onClick={logout} buttonType={ButtonType.SECONDARY} disabled={isLoading}>
          Log Out
        </Button>
      </div>
    </div>
  )
}

export default UserProject