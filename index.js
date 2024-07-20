"use strict";
const express = require("express");
const { WebSocketServer } = require("ws");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const msg = message.toString();

        await streamMessage(ws, 'echo', msg);

        const reversedMsg = msg.split('').reverse().join('');
        await streamMessage(ws, 'reverse', reversedMsg);

        const lastChar = msg[msg.length - 1];
        const count = msg.slice(0, -1).split(lastChar).length - 1;
        ws.send(JSON.stringify({ type: 'count', character: lastChar, count: count }));
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

const streamMessage = async (ws, type, message) => {
    let streamedMessage = '';
    for (let i = 0; i < message.length; i++) {
        await delay(100);
        streamedMessage += message[i];
        ws.send(JSON.stringify({ type: type, content: streamedMessage }));
    }

    await delay(100);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log('WebSocket server is running');
