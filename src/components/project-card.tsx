import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ProjectCardProps {
  project: UserProjectMetadata,
  selected?: boolean,
  handleSelect?: (project: UserProjectMetadata) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, selected = false, handleSelect = () => { } }) => {
  const getSelectedClass = () => {
    return selected ? 'border-blue-500 border-2' : 'border-gray-300 border-2'
  }

  return (
    <div className={twMerge('w-full p-4 rounded-lg flex flex-col hover:cursor-pointer', getSelectedClass())} onClick={() => handleSelect(project)}>
      <h3 className='font-semibold'>{project.name}</h3>
      <p className='text-xs text-gray-400'>{project.id}</p>
    </div>
  )
}

export default ProjectCard