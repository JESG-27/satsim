
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        this.prompt(chatBox)

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    prompt(chatbox) {
        this.messages.push({ name: "Bot", message: "Bienvenido a SATSIM. Yo puedo ayudarte con tus dudas. <br>  1. Si quieres conocer más de nosotros da clic aquí <a href = 'https://digicor.com.au/advanced-search'> SATSIM web</a> . <br> 2. Si deseas ver los tutoriales que tenemos da clic aquí <a href = 'https://digicor.com.au/advanced-search'> Tutoriales</a>." });
        this.updateChatText(chatbox)
    }

    toggleState(chatbox) {
        this.state = !this.state;
        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        // fetch($SCRIPT_ROOT + '/predict', {
        //     method: 'POST',
        //     body: JSON.stringify({ message: text1 }),
        //     mode: 'cors',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //   })
          fetch('http://127.0.0.1:5001/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin':'http://127.0.0.1:5001/predict',
                'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Bot", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Bot")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();

// let promise = new Promise(chatbox.display(resolve, reject) {
//     // the function is executed automatically when the promise is constructed
  
//     // after 1 second signal that the job is done with the result "done"
//     setTimeout(() => resolve("Done"), 1000);
//   });
