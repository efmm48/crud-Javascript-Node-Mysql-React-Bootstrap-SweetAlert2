import './App.css';
import { useState } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


function App() {

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(0);
// eslint-disable-next-line no-unused-vars
  const [editar, setEditar] = useState(false);

  const [empleadosList, setEmpleadosList] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      
      MySwal.fire({
        title: <strong>Registro exitosos!!!</strong>,
        html: <i>El empleado <strong>{nombre}</strong> fue registrado con exito!!!</i>,
        icon: 'success',
        timer:3000
      });
    }).catch(function(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,  
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      limpiarCampos();

      MySwal.fire({
        title: <strong>Actualizacion exitosa!!!</strong>,
        html: <i>El empleado <strong>{nombre}</strong> fue actualizado con exito!!!</i>,
        icon: 'success',
        timer:3000
      });      
    }).catch(function(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  const deleteEmpleado = (val) => {    

      MySwal.fire({
        title: <strong>Confirmar eliminado?</strong>,
        html: <i>Realmente desea eliminar a <strong>{val.nombre}</strong>?</i>,
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText: 'Si, eliminarlo!'   
        
      }).then(result=>{
        if(result.isConfirmed){
          Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
            getEmpleados();
            limpiarCampos();          

            MySwal.fire(
              'Eliminado!',
              val.nombre+' fue eliminado.',
              'success'
            )
          }).catch(function(error){
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No se logro eliminar el empleado!",
              footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
            });
          });
        }
      });      
    
  };



  const limpiarCampos = () => {
    setId("");
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setEditar(false);
  }

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((respose) => {
      setEmpleadosList(respose.data);
    });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          <h5>GESTION DE EMPLEADOS</h5>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input onChange={(event) => { setNombre(event.target.value); }} type="text" className="form-control" value={nombre} placeholder="Ingrese un Nombre" aria-label="Nombre" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input onChange={(event) => { setEdad(event.target.value); }} type="number" className="form-control" value={edad} placeholder="Ingrese Edad" aria-label="Edad" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais:</span>
            <input onChange={(event) => { setPais(event.target.value); }} type="text" className="form-control" value={pais} placeholder="Ingrese Pais" aria-label="Pais" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input onChange={(event) => { setCargo(event.target.value); }} type="text" className="form-control" value={cargo} placeholder="Ingrese Cargo" aria-label="Cargo" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años:</span>
            <input onChange={(event) => { setAnios(event.target.value); }} type="number" className="form-control" value={anios} placeholder="Ingrese Años" aria-label="Años" aria-describedby="basic-addon1" />
          </div>
        </div>
        <div className="card-footer text-muted">
            { editar? 
              <div>
              <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
              <button className='btn btn-info' onClick={limpiarCampos}>Cancelar</button>
              </div>
              :<button className='btn btn-success' onClick={add}>Registrar</button>
            }          
        </div>
      </div>

      <table className="table table-striped">
        <div className='lista'>
          <button onClick={getEmpleados}>Listar</button>
        </div>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Años</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val, key) => {
            return <tr key={val.id}>
              <th>{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" onClick={() => { editarEmpleado(val); }} className="btn btn-info">Editar</button>
                  {/* Aquí debes agregar la función para eliminar empleados */}
                  <button type="button" onClick={()=>{deleteEmpleado(val);}} className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;