const fs = require("fs").promises;

async function crearArchivo(nombre, contenido) {
  return fs
    .writeFile(`${nombre}.txt`, contenido)
    .then(() => console.log(`Archivo ${nombre}.txt creado`))
    .catch((error) => console.error(`Error al crear ${nombre}.txt:`, error));
}

let arregloPromesas = [];

for (let index = 1; index <= 5; index++) {
  arregloPromesas.push(crearArchivo(`holaMundo${index}`, "Hola Mundo"));
}
Promise.all(arregloPromesas)
  .then(() => console.log("Todos los archivos fueron creados"))
  .catch((error) => console.error("Error al crear los archivos:", error));
