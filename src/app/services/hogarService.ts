import axios from 'axios';

// Definimos la respuesta que nos da tu Spring Boot (HogarResponse)
export interface HogarResponse {
  id: number;
  nombre: string;
  codigoInvitacion: string;
}

/**
 * Función para crear un hogar en el backend
 * @param usuarioId ID del usuario que crea el hogar
 * @param nombre Nombre del nuevo hogar
 */
export const crearHogar = async (usuarioId: number, nombre: string): Promise<HogarResponse> => {
  // El '/api' usa el proxy que configuramos en vite.config.ts
  // Cambia temporalmente la línea 17 de hogarService.ts a:
const response = await axios.post<HogarResponse>('http://localhost:8080/api/hogares/crear', {
    usuarioId,
    nombre
  });
  return response.data;
};