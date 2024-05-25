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
    const { email, password } = data
    console.log(data);

    parent.postMessage({ pluginMessage: { type: 'connect-plugin', content: { email, password } } }, '*');
  }

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, content } = event.data.pluginMessage;

      if (type === 'plugin-connected') {
        const { userId, projects } = content;
        console.log("plugin-connected", content);

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