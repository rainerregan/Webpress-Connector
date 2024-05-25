import React, { useEffect, useState } from 'react'
import './index.css'
import LoginForm from './components/login-form'
import { set } from 'lodash'
import UserProject from './pages/user-project'

enum PageSelection {
  LOGIN,
  PROJECTS,
  DONE
}

interface UserProjectMetadata {
  name: string,
  id: string
}

interface User {
  userId: string,
}

export interface ComponentProps {
  setPageSelection: React.Dispatch<React.SetStateAction<PageSelection>>,
  pageSelection: PageSelection,
  setUserProjectList: React.Dispatch<React.SetStateAction<UserProjectMetadata[] | null>>
  userProjectList: UserProjectMetadata[] | null,
  setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>
}

const App = () => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null) // Set state untuk logged user current
  const [userProjectList, setUserProjectList] = useState<UserProjectMetadata[] | null>(null) // Set state untuk list project user
  const [pageSelection, setPageSelection] = useState<PageSelection>(PageSelection.LOGIN) // Current page

  // Request data user yang telah tersimpan.
  const getSavedUser = async () => {
    parent.postMessage({ pluginMessage: { type: 'get-saved-user' } }, '*');
  }

  useEffect(() => {
    // Jika userProjectList ada, maka set page selection ke projects
    if (userProjectList) setPageSelection(PageSelection.PROJECTS)
  }, [userProjectList])

  useEffect(() => {
    // Get saved user ketika pertama kali render
    getSavedUser()

    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      // Jika plugin controller mengirimkan pesan bahwa plugin terhubung, maka set logged user dan user project list
      if (type === 'saved-user') {
        const { userId, projects } = content;
        if (userId) setLoggedUser({ userId })
        if (projects) setUserProjectList(projects)
      }
    };
  }, [])

  useEffect(() => {
    if (!loggedUser) {
      // Jika logged user tidak ada, maka set page selection ke login
      setPageSelection(PageSelection.LOGIN)
    } else {
      // Jika logged user ada, maka set page selection ke projects
      setPageSelection(PageSelection.PROJECTS)
    }
  }, [loggedUser])

  // Fungsi untuk menampilkan content page
  const getPageContent = () => {
    switch (pageSelection) {
      case PageSelection.LOGIN:
        return <LoginForm
          setLoggedUser={setLoggedUser}
          setPageSelection={setPageSelection}
          pageSelection={pageSelection}
          setUserProjectList={setUserProjectList}
          userProjectList={userProjectList}
        />
      case PageSelection.PROJECTS:
        return <UserProject
          setLoggedUser={setLoggedUser}
          setPageSelection={setPageSelection}
          pageSelection={pageSelection}
          setUserProjectList={setUserProjectList}
          userProjectList={userProjectList}
        />
      case PageSelection.DONE:
        return <div>Done</div>
    }
  }

  return (
    <div className='p-4'>
      <section className="logo mb-4">
        <img src="https://webpress.id/_next/static/media/webpress_logo.68043666.svg" alt="Webpress Logo" className="w-[150px]" />
      </section>
      <section className="content">
        {getPageContent()}
      </section>
    </div>
  )
}

export default App