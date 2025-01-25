CREATE DATABASE correos;

USE correos;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (nombre, correo) VALUES
('Kevin Aguirre', 'kevin@example.com'),
('Santiago Giraldo', 'santiago@example.com'),
('Juan Pérez', 'juan@example.com');

