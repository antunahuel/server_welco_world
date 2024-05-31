import express from "express";
import moment from "moment";
// importando fs
import fs from "node:fs/promises";
// definir ruta directorio raíz
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));

//middleware JSON

app.use(express.json());

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto http://localhost:3000");
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public/index.html"))
});

// rutas endpoints post crear nuevo documentos

app.post("/api/documentos", async (req, res) => {
    try {

        let { archivo, contenido } = req.body
        let fecha = moment().format('LLLL');


        if (!archivo || !contenido) {
            return res.status(400).json({
                msg: "Debe proporcionar datos para crear archivo"
            })
        }

        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}.txt`);
        await fs.writeFile(rutaArchivo, contenido+fecha, "utf-8");

        //creando respuesta de servidor
        res.status(201).json({
            msg: "Archivo creado con éxito",
            nombreArchivo: archivo+".txt" 
        });

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear archivo",
        });

    }
});

// ruta leer archivo

app.get("/api/documentos/:archivo", async (req, res) => { //ruta dinámica con parametro nombre
    try {
        let { archivo } = req.params;
        //  console.log(archivo); 
        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}.txt`);// concateno extensión archivo
        let contenido = await fs.readFile(rutaArchivo, "utf-8")
        res.json({
            msg: "Se ha leido correctamente el archivo" + archivo,
            archivo,
            contenido
        });
   
    } catch (error) {
        console.log(error);
        res.status(500).json({
        msg: "no se pudo leer archivo"
        })
    }
});


// ruta renombrar archivo
app.put("/api/documentos", async (req, res) => {
    try {
        //obteniedo datos enviados
        let { nombre, nuevoNombre } = req.body

        // en caso de recibir datos vacios validación

        if (!nombre || !nuevoNombre) {
            return res.status(400).json({
                msg: "Debe proporcionar datos necesarios para renombrar arcchivo"
            })
        }
        //disponibilizando rutas de origen y destino
        let rutaOrigen = path.resolve(__dirname, `./public/files/${nombre}.txt`);// concateno extensión archivo
        let rutaDestino = path.resolve(__dirname, `./public/files/${nuevoNombre}.txt`);

        await fs.rename(rutaOrigen, rutaDestino);   
       

        //creando respuesta de servidor
        res.status(201).json({
            msg: "Archivo renombrado con éxito",
            nuevoArchivo: nuevoNombre+".txt" // concateno extensión archivo
        });

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo renombrar archivo",
        });

    }
});

// ruta eliminar archivo

app.delete("/api/documentos", async (req, res) => { //ruta dinámica con parametro nombre
    try {
        let { archivo } = req.query;
        if(!archivo){
            return res.status(400).json({
                msg: "Debe proporcionar el nombre del archivo"
            })
        }
        //  console.log(archivo); 
        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}.txt`);// concateno extensión archivo
        await fs.unlink(rutaArchivo);
        res.json({
            msg: "Se ha eliminado correctamente el archivo" + archivo,
        });
   
    } catch (error) {
        console.log(error);
        res.status(500).json({
        msg: "no se pudo eliminar archivo"
        })
    }
});