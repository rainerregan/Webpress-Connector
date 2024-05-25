
export const login = async (email: string, password: string) => {
  if (!email || !password) throw new Error('Please enter email and password');
  const API_URL = process.env.API_URL;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      "Access-Control-Allow-Origin": "true",
    }
  })
  return response;
}

export const registerPlugin = async (email: string, password: string, figmaUser: User) => {
  if (!email || !password) throw new Error('Please enter email and password');
  if (!figmaUser) throw new Error('Please login to figma');
  const API_URL = process.env.API_URL;
  const bodyData = JSON.stringify({ email, password, figmaUser });

  const response = await fetch(`${API_URL}/plugin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
    },
    body: bodyData
  })

  return response;
}