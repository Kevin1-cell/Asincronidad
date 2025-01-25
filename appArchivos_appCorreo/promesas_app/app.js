const nodemailer = require("nodemailer");
const readlineSync = require("readline-sync");
const mysql = require("mysql");

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
    const tabla = obtenerTabla();
    const usuarios = await obtenerUsuarios(tabla);

    console.log("Enviando correos...");
    await Promise.all(
      usuarios.map(async (usuario) => {
        await enviarCorreo(
          usuario,
          "Asunto del correo",
          "Contenido del correo"
        );
      })
    );

    console.log("Todos los correos han sido enviados.");
  } catch (error) {
    console.error("Hubo un error en el proceso:", error);
  }
}

main().catch(console.error);
