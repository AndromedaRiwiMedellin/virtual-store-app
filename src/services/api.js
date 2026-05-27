const BASE_URL = "http://localhost:5000/api";

// Función de Inicio de Sesión (Login) - ¡CORREGIDA!
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

// Función de Registro de Usuarios - ¡ASEGURADA!
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