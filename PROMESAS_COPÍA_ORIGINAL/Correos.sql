CREATE DATABASE correos;

USE correos;

CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
	correo VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (correo) VALUES 
('usuario1@gmail.com'), ('usuario2@gmail.com'), ('usuario3@gmail.com');

SELECT * FROM usuarios;