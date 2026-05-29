const BASE_URL = "https://service.andromeda.andrescortes.dev";

// 1. Función de Inicio de Sesión (Login)
export async function login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        let errorMessage = "Credenciales inválidas";
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
        } catch (e) {
            errorMessage = `Error del servidor (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

// 2. Función de Registro de Usuarios
export async function register(fullName, email, password, confirmPassword) {
    console.log("Disparando petición HTTP a:", `${BASE_URL}/auth/register`);

    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fullName,
            email,
            password,
            confirmPassword
        }),
    });

    if (!response.ok) {
        let errorMessage = "Error al registrar el usuario";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = `Error del servidor (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    const responseText = await response.text();
    if (!responseText) {
        return { message: "¡Cuenta registrada con éxito!" };
    }

    try {
        return JSON.parse(responseText);
    } catch (err) {
        return { message: "¡Cuenta registrada con éxito!" };
    }
}

// 🚀 3. NUEVA FUNCIÓN DE GOOGLE AUTENTICACIÓN (Agregada perfectamente usando tu BASE_URL)
export async function googleAuth(googleId, email, fullName, profileImage) {
    console.log("Disparando petición HTTP de Google a:", `${BASE_URL}/auth/google-auth`);

    const response = await fetch(`${BASE_URL}/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleId, email, fullName, profileImage }),
    });

    if (!response.ok) {
        let errorMessage = "Error en la autenticación con Google";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = `Error del servidor (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}