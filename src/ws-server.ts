/**
 * @name Instanciacion de un server websocket en
*/

// Importamos los paquetes necesarios
import * as express from 'express'; // Framework NodeJS
import * as http from 'http'; // Modulo servidor HTTP
import * as WebSocket from 'ws'; // Modulo servidor WebSocket

// Inicializacion de una nueva applicacion Express
const app = express();

// Inicializacion de un servidor HTTP (soporte de comunicacion con el cliente)
const server = http.createServer(app); // le pasamos en parametro la app al server

// Inicializacion de una instancia de WebSocket
const wss = new WebSocket.Server({ server }); // Server(): el parametro server es un objeto json 
                                            // que sirve de soporte de comunicacion

// El servidor WebSocket escucha algunos eventos...
wss.on('connection', (ws: WebSocket) => {
    // La conexion esta bien, enviamos un mensaje de que connexion ok
    ws.on('message', (message: string) => {

        // Muestra el mensaje en la consola y vuelve al cliente
        console.log('Recibido: %s', message);
        ws.send(`Hola, usted viene de enviar -> ${message}`);

    });

    //Envia inmediatamente una informacion al cliente conectado
    ws.send('Hola, soy el servidor WebSocket');
});

// Lanzamos el servidor
server.listen(process.env.PORT || 8999, () => {
    console.log('El servidor ha sido iniciado y escucha en la direccion:' + server.address());
});