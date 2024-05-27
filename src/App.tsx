import React, { useEffect, useState } from 'react'
import LoginForm from './components/login-form'
import './index.css'
import UserProject from './pages/user-project'

export enum PageSelection {
  LOGIN,
  PROJECTS,
  DONE
}

export interface ComponentProps {
  userProjectList: UserProjectMetadata[] | null,
  pageSelection: PageSelection,
  loggedUser?: UserData | null,
  currentFigmaUser?: User | undefined,
  setPageSelection: React.Dispatch<React.SetStateAction<PageSelection>>,
  setUserProjectList: React.Dispatch<React.SetStateAction<UserProjectMetadata[] | null>>
  setLoggedUser: React.Dispatch<React.SetStateAction<UserData | null>>
}

const App = () => {
  const [currentFigmaUser, setCurrentFigmaUser] = useState<User | undefined>()
  const [loggedUser, setLoggedUser] = useState<UserData | null>(null) // Set state untuk logged user current
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
        const { userId, projects, figmaUser } = content;
        if (userId) setLoggedUser({ userId })
        if (projects) setUserProjectList(projects)
        if (figmaUser) setCurrentFigmaUser(figmaUser)
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
          loggedUser={loggedUser}
          currentFigmaUser={currentFigmaUser}
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