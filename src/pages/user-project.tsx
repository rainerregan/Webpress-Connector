import React, { useEffect, useState } from 'react'
import { ComponentProps } from '../App'
import Button, { ButtonType } from '../components/button';
import ProjectCard from '../components/project-card';

const UserProject: React.FC<ComponentProps> = (props) => {
  const [selectedProject, setSelectedProject] = useState<UserProjectMetadata | undefined>()

  const logout = () => {
    parent.postMessage({ pluginMessage: { type: 'logout' } }, '*');
  }

  const handleSelect = (project: UserProjectMetadata) => {
    setSelectedProject(project)
  }

  const handleExport = () => {
    if (!selectedProject) return

  }

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      if (type === 'logout-success') {
        props.setLoggedUser(null)
        props.setUserProjectList([])
      }
    };
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <p>Daftar proyek yang tersedia</p>
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
      <div className='flex flex-col gap-2'>
        <Button onClick={handleExport} disabled={!selectedProject}>
          Export Project
        </Button>
        <Button onClick={logout} buttonType={ButtonType.SECONDARY}>
          Log Out
        </Button>
      </div>
    </div>
  )
}

export default UserProject