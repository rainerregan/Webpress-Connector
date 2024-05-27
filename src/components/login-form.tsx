import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ComponentProps } from '../App'
import Button from './button'

interface IFormInput {
  email: string,
  password: string
}

const LoginForm: React.FC<ComponentProps> = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (data: any) => {
    setIsLoading(true)
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
        setIsLoading(false)
      }
    };
  }, []);

  return (
    <div>
      <div>
        <h1 className='text-2xl font-semibold'>Login</h1>
        <p className='text-xs text-gray-400'>Koneksikan Figma dengan Webpress.id</p>
      </div>
      <form className='my-4 flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <label className='w-full' htmlFor="email">Email</label>
          <input className='w-full px-4 py-2 border rounded-lg focus:ring-blue-500' type="email" id="email" placeholder="Masukkan email" {...register('email')} />
        </div>
        <div className='flex flex-col gap-2 mb-4'>
          <label className='w-full' htmlFor="password">Password</label>
          <input className='w-full px-4 py-2 border rounded-lg focus:ring-blue-500' type="password" id="password" placeholder="Masukkan password" {...register('password')} />
        </div>
        <Button className='mt-4' type='submit'>
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}

export default LoginForm