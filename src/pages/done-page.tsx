import React from 'react'
import Button from '../components/button'

interface DonePageProps {
  projectId: string
}

const DonePage: React.FC<DonePageProps> = ({ projectId }) => {
  const handleOpenWeb = () => {
    parent.postMessage({ pluginMessage: { type: 'open-project-web', content: { projectId } } }, '*');
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='font-bold text-3xl'>Selamat!</h2>
      <p className='text-xs'>Desain berhasil di Export! Kunjungi editor project di Webpress untuk melanjutkan.</p>
      <Button onClick={handleOpenWeb}>
        Kunjungi Editor Project
      </Button>
    </div>
  )
}

export default DonePage