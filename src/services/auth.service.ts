
export const login = async (email: string, password: string) => {
  if (!email || !password) throw new Error('Please enter email and password');
  const API_URL = process.env.API_URL;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      "Access-Control-Allow-Origin": "true"
    }
  })
  return response;
}