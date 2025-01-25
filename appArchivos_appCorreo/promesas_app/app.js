const fs = require("fs");
const nodemailer = require("nodemailer");
const readlineSync = require("readline-sync");
const mysql = require("mysql");

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tolimense1@",
  database: "correos",
  port: 3306,
  connectTimeout: 30000,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

// Función para leer el contenido de un archivo
function leerArchivo(ruta) {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

const geminiApiKey = "AIzaSyB_G3EBLQkEXnlDAcZ3Vv5UkhiAKWjYVKg";
const geminiApiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
  geminiApiKey;

// Función para obtener los textos del texto usando la API de Gemini
function generarTexto(contenidoArchivo) {
  const data = {
    contents: [
      {
        parts: [
          {
            text:
              "Necesito generes textos a partir de este texto base, contextualizalo" +
              contenidoArchivo,
          },
        ],
      },
    ],
  };

  return fetch(geminiApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const botResponse = data.candidates[0].content.parts[0].text;
        console.log(`Archivos de textos generados :D: ${botResponse}`);
        return botResponse;
      } else {
        throw new Error("Invalid response format");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return "Lo siento, hubo un problema con la solicitud.";
    });
}

// Función para enviar correos electrónicos
async function enviarCorreo(destinatario, asunto, contenido) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kevinherveo14@gmail.com",
      pass: "khfx ebmk dkti ednb",
    },
  });

  let mailOptions = {
    from: "kevinherveo14@gmail.com",
    to: destinatario,
    subject: asunto,
    text: contenido,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a: ${destinatario}`);
  } catch (error) {
    console.error(`Error al enviar correo a ${destinatario}:`, error);
  }
}

// Función para obtener todos los correos de los usuarios desde la base de datos
async function obtenerUsuarios(tabla) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT correo FROM ${tabla}`, (err, results) => {
      if (err) return reject(err);
      const correos = results.map((row) => row.correo);
      resolve(correos);
    });
  });
}

// Función para obtener el nombre de la tabla desde la entrada del usuario
function obtenerTabla() {
  return readlineSync.question(
    "Ingresa el nombre de la tabla en la Base de Datos para enviar los correos: "
  );
}

// Función principal que coordina todo
async function main() {
  try {
    const rutaArchivo = readlineSync.question(
      "Ingresa la ruta del archivo base para contextualizar: "
    );

    // Leer el contenido del archivo
    const contenidoArchivo = await leerArchivo(rutaArchivo);
    console.log("Generando textos informativos...");
    const archivosGenerados = await generarTexto(contenidoArchivo);

    const tabla = obtenerTabla();
    const usuarios = await obtenerUsuarios(tabla);

    console.log("Enviando correos...");
    await Promise.all(
      usuarios.map(async (usuario) => {
        await enviarCorreo(
          usuario,
          "Archivos de texto creados",
          archivosGenerados
        );
      })
    );

    console.log("Todos los correos han sido enviados.");
  } catch (error) {
    console.error("Hubo un error en el proceso:", error);
  }
}

main().catch(console.error);
