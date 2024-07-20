"use strict";

(function () {
    let ws;
    const messages = document.getElementById('messages');
    const wsOpen = document.getElementById('ws-open');
    const wsClose = document.getElementById('ws-close');
    const wsSend = document.getElementById('ws-send');
    const wsInput = document.getElementById('ws-input');

    function showMessage(message) {
        if (!messages) {
            return;
        }
        messages.textContent += `\n${message}`;
        messages.scrollTop = messages.scrollHeight;
    }

    function updateMessageLine(type, content) {
        const lines = messages.textContent.split('\n');
        const lineIndex = lines.findIndex(line => line.startsWith(`${type}:`));
        if (lineIndex === -1) {
            lines.push(`${type}: ${content}`);
        } else {
            lines[lineIndex] = `${type}: ${content}`;
        }
        messages.textContent = lines.join('\n');
        messages.scrollTop = messages.scrollHeight;
    }

    function closeConnection() {
        if (!!ws) {
            ws.close();
        }
    }

    wsOpen.addEventListener('click', () => {
        closeConnection();
        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://${location.host}`;
        ws = new WebSocket(wsUrl);
        ws.addEventListener('error', () => {
            showMessage('WebSocket error');
        });
        ws.addEventListener('open', () => {
            showMessage('WebSocket connection established');
        });
        ws.addEventListener('close', () => {
            showMessage('WebSocket connection closed');
        });
        ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            if (data.type === 'echo' || data.type === 'reverse') {
                updateMessageLine(data.type.charAt(0).toUpperCase() + data.type.slice(1), data.content);
            } else if (data.type === 'count') {
                showMessage(`Count of '${data.character}': ${data.count}`);
            }
        });
    });

    wsClose.addEventListener('click', closeConnection);

    wsSend.addEventListener('click', () => {
        const val = wsInput?.value;
        if (!val) {
            return;
        } else if (!ws) {
            showMessage('No WebSocket connection');
            return;
        }
        ws.send(val);
        showMessage(`Sent "${val}"`);
        wsInput.value = '';
    });
})();
