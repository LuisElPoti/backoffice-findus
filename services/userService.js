import apiRoutes from "../api_paths";
import axios from "axios";


const formato_nombres = (nombres) => {
    return nombres.trim() // Eliminar espacios al principio y al final
                  .toLowerCase() // Convertir toda la cadena a minúsculas
                  .split(' ') // Dividir la cadena en palabras
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar la primera letra de cada palabra
                  .join(' '); // Volver a unir las palabras con un espacio en blanco
}

const calcular_porcentaje_diferencia_entre_semana = (semana_actual, semana_pasada) => {
    if (semana_pasada === 0) {
        return 100;
    }
    return ((semana_actual - semana_pasada) / semana_pasada) * 100;
}



//Funciones de comunicacion con el servidor
const registrarUsuario = async (usuario) => {
    try {
        const response = await axios.post(apiRoutes.registrarUsuario(), usuario);
        return response;
    } catch (error) {
        return error.response;
    }
}

const confirmarCorreo = async (data) => {
    try {
        const response = await axios.post(apiRoutes.confirmarCorreo(), data);
        return response;
    } catch (error) {
        return error.response;
    }
}

const solicitarCambioContrasena = async (data) => {
    try {
        console.log("KLKKKK")
        const response = await axios.post(apiRoutes.solicitarCambioContrasena(), data);
        return response;
    } catch (error) {
        return error.response;
    }
}

const verificarCodigoCambioContrasena = async (data) => {
    try {
        const response = await axios.post(apiRoutes.verificar_codigo_cambio_contrasena(), data);
        return response;
    } catch (error) {
        return error.response;
    }
}

const  cambiarContrasena = async (data, token) => {
    try {
        const response = await axios.post(apiRoutes.cambiar_contrasena(), data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

export const obtenerInfoBasicaUserBD = async (token) => {
    try {
        const response = await axios.get(apiRoutes.obtenerInfoBasicaUser(),{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

const  verificarToken = async (token) => {
    try {
        const response = await axios.get(apiRoutes.verificar_token_valido(), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}


const login = async (data) => {
    try {
        const response = await axios.post(apiRoutes.loginUsuario(), data);
        return response;
    } catch (error) {
        return error.response;
    }
}

const obtenerUsuariosTabla = async (page, limit, filtros) => {
    try {
        const response = await axios.get(`${apiRoutes.obtenerUsuariosTabla(page, limit)}?${filtros}`);
        console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

const obtenerUsuarioByID = async (id) => {
    try {
        const response = await axios.get(apiRoutes.obtenerUsuarioByID(id));
        return response;
    } catch (error) {
        return error.response;
    }
}

const actualizarAdminAUsuario = async (id, data) => {
    try {
        const response = await axios.put(apiRoutes.actualizarAdminAUsuario(id), data);
        return response;
    } catch (error) {
        return error.response;
    }
}


const obtenerInformacionesHome = async (token) => {
    try {
        const response = await axios.get(apiRoutes.obtenerInformacionesHome(), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

//Exportar funciones
export {
    registrarUsuario,
    formato_nombres,
    confirmarCorreo,
    solicitarCambioContrasena,
    verificarCodigoCambioContrasena,
    cambiarContrasena,
    login,
    verificarToken,
    obtenerUsuariosTabla,
    obtenerUsuarioByID,
    actualizarAdminAUsuario,
    obtenerInformacionesHome,
    calcular_porcentaje_diferencia_entre_semana
};