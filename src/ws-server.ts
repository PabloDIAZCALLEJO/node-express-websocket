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

    // Datos a transmitir a los clientes
    let envelop: any = {}; // object any = puedo hacer lo que quiera con el

    // La conexion esta bien, enviamos un mensaje de que connexion ok
    ws.on('message', (message: any) => {

        // Muestra el mensaje en la consola y vuelve al cliente
        console.log('Recibido: %s [%d]', message, new Date()); // %s = string (lo remplaza por message que es variable)
        envelop.message = ' Su mensaje : ' + message + ' ha sido enviado '; // concepto de "eco local"

        // Eco para el emisor...
        ws.send(JSON.stringify(envelop)); //metodo send de ws:

        // Broadcast hacia los otros clientes --> Difundir el mensaje hacia todos los clientes
        wss.clients
            .forEach (client => {
                if (client != ws) {
                    envelop.message = 'Un nuevo mensaje ha sido transmitido :' + message;
                    client.send(JSON.stringify(envelop));
                }
            });
    });

    //Envia inmediatamente una informacion al cliente conectado
    ws.send({message: 'Hola cliente!! Bienvenido al servidor WebSocket de "ChatApp"'});
});

// Lanzamos el servidor
server.listen(process.env.PORT || 8999, () => {
    console.log('El servidor ha sido iniciado y escucha en la direccion:' + server.address()); // OJO AQUI!!! 
});