import React, { useState, useEffect } from "react";
import { AiOutlineSetting } from 'react-icons/ai';
import { FaLanguage, FaUser, FaLock } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';
import { obtenerInfoUserPerfilBD, extraerEdad } from "../../../services/userService.js";
import {obtenerToken} from "../../../services/cookiesServices.js";
import FotoPerfirDefault from "../../../public/assets/profilePicture.svg";
import { formatearFecha } from "../../../services/publicacionServices.js";

export default function Configuracion() {
    // Estado para rastrear la sección seleccionada
    const [selectedSection, setSelectedSection] = useState("general");
    const [password, setPassword] = useState('');
    const [validations, setValidations] = useState({
        minLength: false,
        hasUpperLower: false,
        hasNumber: false,
        hasValidSymbols: false,
    });
    const [userData, setUserData] = useState({});
    const [userStatistics, setUserStatistics] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        obtenerInfoUserPerfilBD(obtenerToken()).then((response) => {
            if(response.status === 200){
                 console.log("Información del perfil: ",response.data);
                setUserData(response.data.informacionesPerfil);
                setUserStatistics(response.data.estadisticasPublicaciones);
            }else{
                console.log("Error al obtener la información del perfil: ",response.data);
            }
        }).catch((error) => {
            console.log("Error al obtener la información del perfil: ",error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    
    
    

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        setValidations({
            minLength: value.length >= 8 && value.length > 0,
            hasUpperLower: /[a-z]/.test(value) && /[A-Z]/.test(value) && value.length > 0,
            hasNumber: /\d/.test(value) && value.length > 0,
            hasValidSymbols: /^[^$%@^+=&!*ñ]*$/.test(value) && value.length > 0,
        });
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-colorResumen">
            <div className="h-[45%] bg-greenBackground items-center relative">
                <h2 className="text-xl text-letterColor font-bold ml-12 mt-8">Configuración</h2>

                {/* Botones para cambiar entre secciones, centrados */}
                <div className="flex justify-center space-x-4 mb-6 mt-4"> 
                    <button
                        className={`py-2 px-4 rounded-md ${selectedSection === "perfil" ? "bg-blueOscuro text-white" : "bg-white text-customBlue"}`}
                        onClick={() => setSelectedSection("perfil")}
                    >
                        <FaUser className="w-5 h-5 inline-block" /> Perfil
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md ${selectedSection === "general" ? "bg-blueOscuro text-white" : "bg-white text-customBlue"}`}
                        onClick={() => setSelectedSection("general")}
                    >
                        <AiOutlineSetting className="w-5 h-5 inline-block" /> General
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md ${selectedSection === "idioma" ? "bg-blueOscuro text-white" : "bg-white text-customBlue"}`}
                        onClick={() => setSelectedSection("idioma")}
                    >
                        <FaLanguage className="w-5 h-5 inline-block" /> Idioma
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md ${selectedSection === "seguridad" ? "bg-blueOscuro text-white" : "bg-white text-customBlue"}`}
                        onClick={() => setSelectedSection("seguridad")}
                    >
                        <FaLock className="w-5 h-5 inline-block" /> Seguridad
                    </button>
                </div>

                {/* Contenido basado en la sección seleccionada, centrado */}
                <div className="flex flex-col items-center">
                    {selectedSection === "general" && (
                        <div className="bg-colorResumen shadow-md rounded-md p-4 mb-4 w-3/4">
                            <h2 className="text-xl font-semibold text-customBlue mb-2">Configuraciones Generales</h2>
                            <p className="text-gray-700">Aquí puedes ajustar las configuraciones generales.</p>
                            {/* Sección dividida de configuraciones generales */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-customBlue mb-2">Notificaciones</h3>
                                <label className="flex items-center mt-2">
                                    <input type="checkbox" className="mr-2" />
                                    Activar notificaciones
                                </label>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-customBlue mb-2">Tema</h3>
                                <label className="flex items-center mt-2">
                                    <input type="checkbox" className="mr-2" />
                                    Usar tema oscuro
                                </label>
                            </div>
                        </div>
                    )}

                    {selectedSection === "perfil" && (
                        <div className="bg-colorResumen shadow-md rounded-md p-4 mb-4 w-3/4">
                            <div className="flex flex-col items-start mb-2">
                            <Avatar src={userData?.urlfotoperfil} sx={{ width: 70, height: 70 }}/>
                            </div>
                            <h2 className="text-xl font-semibold text-customBlue mb-2">Datos del Perfil</h2>
                            {/* Información del perfil */}
                            <div className="text-gray-700 text-left mb-4 mt-4">
                                <p><strong>Nombre:</strong> {userData?.nombre} {userData?.apellido}</p>
                                <p><strong>Correo:</strong> {userData?.email}</p>
                                <p><strong>Tipo de Documento:</strong> {userData?.tipodocumento?.nombretipodocumento}</p>
                                <p><strong>Número del Documento:</strong> {userData?.numerodocumento}</p>
                                <p><strong>Número de Teléfono:</strong> {userData?.numerotelefono}</p>
                                <p><strong>Rol:</strong> {userData?.rol?.nombrerol}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {formatearFecha(userData?.fechanacimiento)} ({extraerEdad(userData?.fechanacimiento)} años)</p>
                            </div>

                            {/* Estadísticas del perfil */}
                            <h2 className="text-xl font-semibold text-customBlue mb-4">Estadísticas del Perfil</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Publicaciones Hechas</h3>
                                    <p className="text-xl font-bold text-blueOscuro">{userStatistics?.totalPublicacionesHechas}</p>
                                </div>
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Publicaciones Activas</h3>
                                    <p className="text-xl font-bold text-blueOscuro">{userStatistics?.totalPublicacionesActivas}</p>
                                </div>
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Publicaciones Cerradas</h3>
                                    <p className="text-xl font-bold text-blueOscuro">0</p>
                                </div>
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Publicaciones Desactivadas</h3>
                                    <p className="text-xl font-bold text-blueOscuro">{userStatistics?.totalPublicacionesInactivas}</p>
                                </div>
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Avistamientos Publicados</h3>
                                    <p className="text-xl font-bold text-blueOscuro">{userStatistics?.totalAvistamientosPublicados}</p>
                                </div>
                                <div className="bg-white shadow-lg rounded-md p-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Comentarios Realizados</h3>
                                    <p className="text-xl font-bold text-blueOscuro">{userStatistics?.totalComentariosHechos}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedSection === "idioma" && (
                        <div className="bg-colorResumen shadow-md rounded-md p-4 mb-4 w-3/4">
                            <h2 className="text-xl font-semibold text-customBlue mb-2">Idioma</h2>
                            <p className="text-gray-700">Selecciona tu idioma preferido.</p>
                            <select className="mt-2 border rounded-md p-2 w-full"> 
                                <option value="es">Español</option>
                                <option value="en">Inglés</option>
                                <option value="fr">Francés</option>
                            </select>
                        </div>
                    )}

                    {selectedSection === "seguridad" && (
                        <div className="bg-colorResumen shadow-md rounded-md p-4 mb-4 w-3/4">
                            <h2 className="text-xl font-semibold text-customBlue mb-2">Seguridad</h2>
                            <p className="text-gray-700">Configura opciones de seguridad.</p>

                            {/* Formulario para cambiar la contraseña */}
                            <h3 className="text-lg font-semibold text-customBlue mb-2">Ingresa tu nueva contraseña</h3>
                            <input
                                className="w-full px-4 py-2 border rounded-lg mt-2"
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                            />

                            <div className="p-4 rounded-lg text-gray-700">
                                <ul className="list-none space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <img
                                            src={validations.minLength ? '/assets/on.png' : '/assets/off.png'}
                                            alt="check"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Tener al menos 8 caracteres
                                    </li>
                                    <li className="flex items-center">
                                        <img
                                            src={validations.hasUpperLower ? '/assets/on.png' : '/assets/off.png'}
                                            alt="check"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Utilizar mayúsculas y minúsculas
                                    </li>
                                    <li className="flex items-center">
                                        <img
                                            src={validations.hasNumber ? '/assets/on.png' : '/assets/off.png'}
                                            alt="check"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Incluir al menos un número
                                    </li>
                                    <li className="flex items-center">
                                        <img
                                            src={validations.hasValidSymbols ? '/assets/on.png' : '/assets/off.png'}
                                            alt="check"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Evitar símbolos excepto $%@^+=&!*ñ
                                    </li>
                                </ul>
                            </div>

                            <input
                                className="w-full px-4 py-2 border rounded-lg mt-2"
                                type="password"
                                placeholder="Confirma tu contraseña"
                            />

                            <button className="mt-4 bg-customBlue text-white py-2 px-4 rounded-lg">
                                Restablecer contraseña
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
