// Register plugin pertama kali
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

// Get user projects menggunakan user id yang telah tersimpan
export const getUserProjects = async (userId: string, figmaUser: User) => {
  if (!userId) throw new Error('User is undefined');
  if (!figmaUser) throw new Error('Please login to figma');
  const API_URL = process.env.API_URL;
  const bodyData = JSON.stringify({
    user_id: userId,
  });

  const response = await fetch(`${API_URL}/plugin/get-projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
    },
    body: bodyData
  })

  return response;
}