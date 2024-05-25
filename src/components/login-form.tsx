import { Button } from 'antd'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ComponentProps } from '../App'

interface IFormInput {
  email: string,
  password: string
}

const LoginForm: React.FC<ComponentProps> = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()

  const onSubmit = (data: any) => {
    // On Submit form, send the data to the plugin controller, to connect the plugin with backend
    const { email, password } = data
    parent.postMessage({ pluginMessage: { type: 'connect-plugin', content: { email, password } } }, '*');
  }

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      // If the plugin controller sends a message that the plugin is connected, then set the logged user and user project list
      if (type === 'plugin-connected') {
        const { userId, projects } = content;
        if (userId) props.setLoggedUser({ userId })
        if (projects) props.setUserProjectList(projects)
      }
    };
  }, []);

  return (
    <div>
      <div>
        <h1>Login</h1>
        <p>Koneksikan Figma dengan Webpress.id</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Email" {...register('email')} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Password" {...register('password')} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm