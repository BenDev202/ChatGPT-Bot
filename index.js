const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    
    appendMessage('user', message);
    userInput.value = '';

    if (message.toLowerCase() === 'developer') {
        setTimeout(() => {
            appendMessage('bot', 'This Source Coded By Armand Benjamin \nGithub : BenDev202');
        }, 2000);
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'f743000fa9mshf6df40025dc60e6p1424e9jsnb03e762deefd',
            'x-rapidapi-host': 'chatgpt-chatgpt3-5.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0613',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        })
    };

    fetch('https://chatgpt-chatgpt3-5.p.rapidapi.com/', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the entire response for debugging
            if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                appendMessage('bot', data.choices[0].message.content);
            } else {
                throw new Error('Unexpected response structure: ' + JSON.stringify(data));
            }
        })
        .catch(err => {
            console.error('Error:', err);
            appendMessage('bot', `An error occurred: ${err.message}. Please try again later.`);
        })
        .finally(() => {
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        });
}

function appendMessage(sender, message) {
    info.style.display = "none";
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}