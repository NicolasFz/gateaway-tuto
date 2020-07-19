const http = require('http');
const url = require('url');
const wsServer = require('ws').Server;

const HTTP_PORT = 8080;
const WS_PORT = 4040;

http.createServer(function(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let query = parsedUrl.query;
    let reponse = 'No message received';
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    if (parsedUrl.pathname == '/broadcast' &&
        query.message != null
    ) {
        res.end('Message received :' + query.message);
        // broadcast the received message
        broadcast(query.message);
    }
    res.end(reponse);
}).listen(HTTP_PORT, function() {
    console.log("HTTP Server listening on: http://localhost:%s", HTTP_PORT);
});


const ws = new wsServer({ port: WS_PORT }, function() {
    console.log("WS Server listening on: ws://localhost:%s", WS_PORT);
});

ws.on('connection', function connection(ws) {
    console.log('new client connected');
});

/** Broadcast msg to each connected clients **/
function broadcast(msg) {
    ws.clients.forEach(function each(client) {
        client.send(msg);
    });
};