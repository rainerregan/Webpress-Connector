import React, { useEffect } from 'react'
import { ComponentProps } from '../App'

const UserProject: React.FC<ComponentProps> = (props) => {

  const logout = () => {
    parent.postMessage({ pluginMessage: { type: 'logout' } }, '*');
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
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default UserProject