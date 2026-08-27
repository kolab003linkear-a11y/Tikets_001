const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:4000/api';

export class ApiClient {

    static async get<T>(
        endpoint: string
    ): Promise<T> {

        const response = await fetch(
            `${API_URL}${endpoint}`
        );

        if (!response.ok) {

            throw new Error(
                `Error ${response.status}: No se pudo obtener la información`
            );

        }

        return response.json();
    }

    static async post<T>(
        endpoint: string,
        body: unknown
    ): Promise<T> {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {

            const errorData =
                await response.json().catch(() => ({}));

            throw new Error(
                errorData.message ||
                'Error al procesar la solicitud'
            );
        }

        return response.json();
    }

    static async put<T>(
        endpoint: string,
        body: unknown
    ): Promise<T> {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {

            const errorData =
                await response.json().catch(() => ({}));

            throw new Error(
                errorData.message ||
                'Error al actualizar la información'
            );
        }

        return response.json();
    }

    static async patch<T>(
        endpoint: string,
        body: unknown
    ): Promise<T> {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {

            const errorData =
                await response.json().catch(() => ({}));

            throw new Error(
                errorData.message ||
                'Error al actualizar la información'
            );
        }

        return response.json();
    }

    static async delete<T>(
        endpoint: string
    ): Promise<T> {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {

            const errorData =
                await response.json().catch(() => ({}));

            throw new Error(
                errorData.message ||
                'Error al eliminar el registro'
            );
        }

        return response.json();
    }
}