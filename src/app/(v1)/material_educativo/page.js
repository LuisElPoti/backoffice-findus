"use client";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { obtenerCategoriaMaterial } from "../../../../services/categoriasServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import {crearRecursoEducativo} from "../../../../services/materialEducativoServices";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertToBase64 } from "../../../../services/filesServices";
import TablaMaterialEducativo from "../../components/tablaMaterialEducativo";
import ModalAdentroMaterialEducativo from "../../components/modalAdentroMaterialEducativo";
import { obtenerRolUsuario } from "../../../../services/cookiesServices";

export default function Material() {
    const [modalVisible, setModalVisible] = useState({mostrar: false, id: undefined});
    const [nuevoRecurso, setNuevoRecurso] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [sendingUserData, setSendingUserData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);
    const [formFilled, setFormFilled] = useState({
        personalInfo: false,
        documentUpload: false,
    });
    const [selectedCategory, setSelectedCategory] = useState(0); // Estado para la categoría seleccionada

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleRowClick = (idMaterialEducativo) => {
        // setSelectedPerson(personData); // Set the clicked person's data
        setModalVisible({mostrar:true, id: idMaterialEducativo});
    };

    const handleInputChange = (section) => {
        setFormFilled((prevState) => ({
            ...prevState,
            [section]: true,
        }));
    };

    const handleSelectChange = (e) => {
        setSelectedCategory(parseInt(e.target.value));
        formik.setFieldValue("idCategoriaMaterial", parseInt(e.target.value));
    };

    useEffect(() => {
        formik.validateForm();
        obtenerCategoriaMaterial().then((response) => {
            if (response.status === 200) {
                setData(response.data);
                console.log("Categorías de material:", response.data);
            }
        });
    }, []);

    const showToast = async (promise, mensaje) => {
        return toast.promise(promise, {
          pending: mensaje,
          // success: 'Usuario registrado correctamente.',
          // autoClose: 8000,
        },{position: "top-center",className: "w-auto"});
      };

    const validationSchema = Yup.object().shape({
        idUsuario: Yup.number()
          .required(""),
        idCategoriaMaterial: Yup.number().moreThan(0)
          .required(""),
        nombre: Yup.string()
          .required("El nombre del Material es requerido"),
        descripcion: Yup.string()
          .required("La descripción es requerida"),
        fileName: Yup.string(),
        fileMimetype: Yup.string(),
        filebase64: Yup.string(),
        urlmaterial: Yup.string(),
      });
    
      const formik = useFormik({
        initialValues: {
          idUsuario: 33,
          idCategoriaMaterial: -1,
          nombre: "",
          descripcion: "",
          fileName: "",
          fileMimetype: "",
          filebase64: "",
          urlmaterial: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // console.log("Valores del formulario: ", values);
            if(formik?.values?.idCategoriaMaterial === 1 || formik?.values?.idCategoriaMaterial === 3){
                values.urlmaterial = "";
                if(values.filebase64 === ""){
                    toast.error("Debe subir un archivo", {position: "top-center",className: "w-auto"});
                    return;
                }
            }else if(formik?.values?.idCategoriaMaterial === 2 || formik?.values?.idCategoriaMaterial === 4){
                values.filebase64 = "";
                values.fileName = "";
                values.fileMimetype = "";
                if(values.urlmaterial === ""){           
                    toast.error("Debe ingresar una URL", {position: "top-center",className: "w-auto"});
                    return;
                }
            }
            console.log("Valores del formulario: ", values);
          setSendingUserData(true);
          showToast(crearRecursoEducativo(values),"Creando Recurso Educativo...").then((response) => {
            // console.log("Respuesta de la peticion: ", response.data);
            if(response.status == 200){
                toast.success("Material educativo creado correctamente", {position: "top-center",className: "w-auto"});
                setSendingUserData(false);
                setFormFilled({
                    personalInfo: false,
                    documentUpload: false,
                });
                setNuevoRecurso(true);
                handlePopupClose();
                // formik.resetForm();
            }
          }).catch((error) => {
            toast.error("Error al crear el material educativo", {position: "top-center",className: "w-auto"});
            console.log("Error al crear el material educativo: ", error);
            setSendingUserData(false);
          });
        }
      });

      const handleFileUpload = async (e) => {
        const file = e.target.files[0]; // Obtener el primer archivo (puedes modificar para múltiples archivos)
        console.log('file:', file);
        if (!file) return;
    
        formik.setFieldValue("fileName", file.name);       // Nombre del archivo
        formik.setFieldValue("fileMimetype", file.type);      // Tipo MIME
        const fileBase64 = (await convertToBase64(file)).split(',')[1]; // Convertir el archivo a base64
        formik.setFieldValue("filebase64", fileBase64); // Base64
    
        console.log('Filename:', file.name);
        console.log('MIME Type:', file.type);
        console.log('Base64:', fileBase64);
    };
    

    
    const handlePopupClose = () => { 
        setExpandedSection(null);
        setOpenModal(false);
        formik.resetForm();
        //Buscar el input de documentios y limpiarlo
        // document.getElementById("fileUpload").value = "";
    };

    const renderInputForCategory = () => {
        if (formik?.values?.idCategoriaMaterial === 1 || formik?.values?.idCategoriaMaterial === 3) {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="fileUpload">
                        Subir archivo
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        onChange={(e) => handleFileUpload(e)}
                    />
                </div>
            );
        } else if (formik?.values?.idCategoriaMaterial === -1){
            return null;
        }
            else {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="urlInput">
                        Ingresar URL
                    </label>
                    <input
                        type="url"
                        id="urlmaterial"
                        name="urlmaterial"
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="https://example.com"
                    />
                </div>
            );
        }
    };

    useEffect(() => {
        // Verifica el rol del usuario solo en el client
        if(obtenerRolUsuario() != "2" && obtenerRolUsuario() != "3"){
            // Notify the user that they don't have permission to access this section
            // Add buttons to redirect to the home page or to log out
            alert("No tienes permiso para acceder a la sección de Material Educativo");
            if (obtenerRolUsuario() === "4") {
                window.location.href = "/servicios";
            } else {
                window.location.href = "/login";
            }
            return null
        }
        }
    , []);

    if(obtenerRolUsuario() != "2" && obtenerRolUsuario() != "3"){
        return null;
      }
    
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-50-50-vertical">
            <ToastContainer />
            {/* <div className="h-[45%] bg-greenBackground relative"> */}
                <h2 className="text-xl text-letterColor font-bold ml-12 mt-8">Material Educativo</h2>
            {/* </div> */}

            <div className="absolute top-8 right-8 flex items-center">
                <Popup
                    trigger={
                        <button className="text-white font-medium bg-blueBoton hover:bg-blueOscuro rounded-lg p-2 flex items-center justify-center h-[40px] transition-colors duration-300" onClick={()=> setOpenModal(true)}>
                            Crear material +
                        </button>
                    }
                    position="right center"
                    modal                    
                    closeOnDocumentClick
                    onClose={() => handlePopupClose()}
                    contentStyle={{ padding: '0px', borderRadius: '8px' }}
                >
                    <div className="p-8 bg-blueBackground rounded-md">
                        <h2 className="text-2xl text-customBlue font-bold mb-4">Crear nuevo material educativo</h2>

                        <form>
                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="w-full text-left px-4 py-2 font-semibold bg-transparent text-customBlue rounded-lg focus:outline-none flex justify-between items-center border-b border-gray-300"
                                    onClick={() => toggleSection('personalInfo')}
                                >
                                    <span>
                                        <img
                                            src={formFilled.personalInfo ? '/assets/on.png' : '/assets/1.png'}
                                            alt="icon"
                                            className="inline-block w-6 h-6 mr-2"
                                        />
                                        Información del material
                                    </span>
                                    <img
                                        src={expandedSection === 'personalInfo' ? '/assets/chevron-up.png' : '/assets/chevron-down.png'}
                                        alt="chevron"
                                        className="w-5 h-3"
                                    />
                                </button>
                                {expandedSection === 'personalInfo' && (
                                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2" htmlFor="name">Nombre del material</label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                onChange={formik.handleChange}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2" htmlFor="description">Descripción del recurso</label>
                                            <textarea
                                                id="descripcion"
                                                name="descripcion"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                rows="4"
                                                onChange={formik.handleChange}
                                            />
                                        </div>

                                        {/* Select dinámico con categorías */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2" htmlFor="category">Categoría del material</label>
                                            <select
                                                id="category"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                onChange={handleSelectChange}
                                            >
                                                <option value={-1}>Selecciona una categoría</option>
                                                {data.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.nombrecategoriamaterial}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Input según categoría seleccionada */}
                                        {renderInputForCategory()}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={formik.handleSubmit}
                                    // el botón se habilita solo si se han llenado todos los campos
                                    disabled={!formik.isValid || sendingUserData}
                                    style={{ backgroundColor: formik.isValid && !sendingUserData ? '#3e86b9' : '#C9C9C9' }}
                                    className=" hover:bg-blueOscuro text-white font-bold py-2 px-4 rounded"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </Popup>
            </div>

            {/* <div className="relative z-10 bg-grayBackground -mt-36 rounded-tl-3xl rounded-tr-3xl p-10 overflow-y-scroll"></div> */}

            <div className="relative mt-[10vh]">
                {/* Pass the handleRowClick to MyTable to trigger the popup */}
                <TablaMaterialEducativo 
                  headers={["ID Material","Nombre del Material","Tipo de Material","Fecha de Creación","Estatus",""]} 
                  onRowClick={handleRowClick} 
                  className={"flex m-auto top-0 left-0 right-0 max-h-[65vh]"}
                  nuevoRecurso={nuevoRecurso}
                  setNuevoRecurso={setNuevoRecurso}
                />
            </div>

            <ModalAdentroMaterialEducativo open={modalVisible.mostrar} idMaterialEducativo={modalVisible.id} handleClose={() => setModalVisible({mostrar: false, id:undefined})}/>
        </div>
    );
}

