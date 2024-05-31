// crear archivos
let formCrear = document.getElementById("formCrear");

formCrear.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        //encabezadod de la solicitud

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let dtaForm = new FormData(formCrear);

        const raw = JSON.stringify({
            "archivo": dtaForm.get("archivo"),
            "contenido": dtaForm.get("contenido")
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // respuesta servidor

        let response = await fetch("/api/documentos", requestOptions);
        //probando ruta y recepcion de datos
        // console.log(response);
        if (response.status == 201) {
            let data = await response.json();
            alert("archivo creado con exito:" + data.nombreArchivo);
            formCrear.reset();
        } else {
            alert(data.msg);
        }

    } catch (error) {
        console.log(error);
        alert("error al crear archivo");
    }

});

// fin crear archivos

//para leer archivos
let formLeer = document.getElementById("formLeer");

formLeer.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        let dtaForm = new FormData(formLeer);
        let nombreArchivo = dtaForm.get("archivo");

        // respuesta servidor

        let response = await fetch("api/documentos/" + nombreArchivo);
        if (response.status == 200) {
            let data = await response.json();
            console.log(data);
            alert(data.msg);

            document.getElementById("labelNombreArchivo").innerHTML = data.archivo;
            document.getElementById("dataArchivo").value = data.contenido;
            formLeer.reset();
        } else {
            alert(data.msg);
        }


    } catch (error) {
        console.log(error);
        alert("error al intentar leer el archivo");
    }

});
//fin leer archivos

//renombrar
let formRename = document.getElementById("formRename");

formRename.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        //encabezadod de la solicitud

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let dtaForm = new FormData(formRename);

        const raw = JSON.stringify({
            "nombre": dtaForm.get("nombre"),
            "nuevoNombre": dtaForm.get("nuevoNombre")
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // respuesta servidor

        let response = await fetch("/api/documentos", requestOptions);
        //probando ruta y recepcion de datos
        // console.log(response);
        if (response.status == 201) {
            let data = await response.json();
            alert(data.msg);
            formRename.reset();
        } else {
            alert(data.msg);
        }

    } catch (error) {
        console.log(error);
        alert("error al crear archivo");
    }

});
//fin renombrar

// delet file

let deletForm = document.getElementById("deletForm");

deletForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        let dtaForm = new FormData(deletForm);
        let archivo = dtaForm.get("archivo");

        // respuesta servidor

        let response = await fetch(`/api/documentos?archivo=${archivo}`, {
            method:"DELETE"
        });

        let data = await response.json();
    
        if (response.status == 200) {
             
            console.log(data);
            alert(data.msg);
            deletForm.reset();
        } else {
            alert(data.msg);
        }


    } catch (error) {
        console.log(error);
        alert("error al intentar eliminar el archivo");
    }

});

