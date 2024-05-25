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
  const [loggedUser, setLoggedUser] = useState<User | null>(null)
  const [userProjectList, setUserProjectList] = useState<UserProjectMetadata[] | null>(null)
  const [pageSelection, setPageSelection] = useState<PageSelection>(PageSelection.LOGIN)

  const getSavedUser = async () => {
    parent.postMessage({ pluginMessage: { type: 'get-saved-user' } }, '*');
  }

  useEffect(() => {
    if (userProjectList) setPageSelection(PageSelection.PROJECTS)
  }, [userProjectList])

  useEffect(() => {
    getSavedUser()

    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      if (type === 'saved-user') {
        const userId = content;
        if (userId) setLoggedUser({ userId })
      }
    };
  }, [])


  useEffect(() => {
    if (!loggedUser) {
      setPageSelection(PageSelection.LOGIN)
    } else {
      setPageSelection(PageSelection.PROJECTS)
    }
  }, [loggedUser])

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
      <section className="logo">
        <img src="https://webpress.id/_next/static/media/webpress_logo.68043666.svg" alt="Webpress Logo" className="w-[150px]" />
      </section>
      <section className="content">
        {getPageContent()}
      </section>
    </div>
  )
}

export default App