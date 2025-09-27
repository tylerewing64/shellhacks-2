const apiUrl = import.meta.env.VITE_API_URL;

export async function loginService(email, password){ 
    return await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
}