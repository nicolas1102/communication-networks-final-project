var body = document.body.innerHTML;
var head = document.head.innerHTML;

// muestra una ventana empergente con el mensaje que se cerrara la ventana que es lo que posteriromente se hara enviando un mensaje al background
function CloseTab() {
    alert(
        "This URL is completely blocked for today. This tab will close after you press OK"
    );
    chrome.runtime.sendMessage({ CloseMe: true });
}

// escucha un envio de mensajes (en este caso de popup.js y si el asusnto de este es empezar un cronometro para bloqueo de pagina)
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.subject === "startBlocking") {
        document.head.innerHTML = blockedPageStyles();
        document.body.innerHTML = blockedPageHTML();
    }
});

// escucha un envio de mensajes (en este caso de popup.js y si el asusnto de este desbloquear pagina)
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.subject === "unlockPage") {
        document.body.innerHTML = body;
        document.head.innerHTML = head;
    }
});

// verifica con el almacenamiento en chrome si la url de la ventana que se abre está bloqueada esto para bloquearla
chrome.storage.local.get("BlockedUrls", (data) => {
    // verifica que no esté vacío el almacenamiento de urls
    if (data.BlockedUrls !== undefined) {
        // busca la url en el almacenamiento te urls bloqueadas
        if (
            data.BlockedUrls.some(
                (e) => e.url === window.location.hostname && e.status === "BLOCKED"
            )
        ) {
            // cierra la ventana
            //CloseTab();
            document.head.innerHTML = blockedPageStyles();
            document.body.innerHTML = blockedPageHTML();
        }
    }
});

const blockedPageHTML = () => {
    return `
    <div id="clouds">
    <div class="cloud x1"></div>
    <div class="cloud x1_5"></div>
    <div class="cloud x2"></div>
    <div class="cloud x3"></div>
    <div class="cloud x4"></div>
    <div class="cloud x5"></div>
    </div>
    <div class="containerMessage">
      <div class="message">
          <div class='title1'>STOP!</div>
          <hr>
          <div class='title2'>YOU'VE SPENT A LOT OF TIME ON SOCIAL MEDIA.</div>
          <br>
          <div class='title3'>Sometimes is better do some productive stuff.</div>
      </div>
      <hr>
    </div>
    <div>
      <p class="title4">You can disble blocking web pages in the extension tool.</p>
    </div>
    `;
};

const blockedPageStyles = () => {
    return `<title>Website Usage Manager</title>
    <style>@import url(https://fonts.googleapis.com/css?family=opensans:500);
    body {
      background: #f16363;
      color: rgb(0, 0, 0);
      font-family: "Open Sans", sans-serif;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
    .containerMessage{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .message {
      text-align: center;
      display: block;
      position: relative;
      flex-direction: column;
      width: 80%;
    }
    .title1 {
      font-size: 10VW;
      position: center;
      letter-spacing: 1vw;
      font-weight: bold;
    }
    .title2 {
      text-align: center;
      padding-top: 2vw;
      display: block;
      position: relative;
      letter-spacing: 0.5vw;
      font-size: 2.5vw;
    }
    .title3 {
      text-align: center;
      display: block;
      position: relative;
      font-size: 2vw;
      font-weight: bold;
      margin-bottom: 2vw;
    }
    .title4 {
      text-align: center;
      display: block;
      position: relative;
      font-size: 1.3vw;
      margin-bottom: 1.5vw;
    }
    .text {
      font-size: 70px;
      text-align: center;
      position: relative;
      display: inline-block;
      margin: 19px 0px 0px 0px;
      z-index: 3;
      width: 100%;
      line-height: 1.2em;
      display: inline-block;
    }
    .containerBotton{
      background: #000000;
      padding: 0.5vw 1vw;
      margin: 2vw;
      z-index: 10;
      cursor: pointer;
      border-radius: 0.5vw;
    }
    .textBotton{
      color: #fff;
      letter-spacing: 0.3vw;
    }
    .right {
      float: right;
      width: 60%;
    }
    
    hr {
      padding: 0;
      border: none;
      border-top: 0.3vw solid #000000;
      background: #000000;
      text-align: center;
      margin: 0 auto;
      width: 35vw;
      height: 0.05vw;
      z-index: 10;
      color: #f16363;
    }
    
    hr:after {
      display: inline-block;
      position: relative;
      top: -0.75vw;
      font-size: 2vw;
      padding: 0 0.2vw;
      background: #f16363;
    }
    
    .cloud {
      width: 22vw;
      height: 10vw;
    
      background: #fff;
      background: linear-gradient(top, #fff 100%);
      background: -webkit-linear-gradient(top, #fff 100%);
      background: -moz-linear-gradient(top, #fff 100%);
      background: -ms-linear-gradient(top, #fff 100%);
      background: -o-linear-gradient(top, #fff 100%);
    
      border-radius: 2vw;
      -webkit-border-radius: 6vw;
      -moz-border-radius: 2vw;
    
      position: absolute;
      margin: 5vw auto 1vw;
      /* siper posicion*/
      z-index: 0;
      transition: ease 2s;
    }
    
    .cloud:after,
    .cloud:before {
      content: "";
      position: absolute;
      background: #fff;
      z-index: 1;
    }
    
    .cloud:after {
      width: 7vw;
      height: 7vw;
      top: -4vw;
      left: 3vw;
    
      border-radius: 2vw;
      -webkit-border-radius: 6vw;
      -moz-border-radius: 2vw;
    }
    
    .cloud:before {
      width: 10vw;
      height: 10vw;
      top: -6vw;
      right: 50px;
    
      border-radius: 4vw;
      -webkit-border-radius: 12vw;
      -moz-border-radius: 6vw;
    }
    
    .x1 {
      top: -4vw;
      left: 8vw;
      -webkit-transform: scale(0.3);
      -moz-transform: scale(0.3);
      transform: scale(0.3);
      opacity: 0.9;
      -webkit-animation: moveclouds 15s linear infinite;
      -moz-animation: moveclouds 15s linear infinite;
      -o-animation: moveclouds 15s linear infinite;
    }
    
    .x1_5 {
      top: -5vw;
      left: 12vw;
      -webkit-transform: scale(0.3);
      -moz-transform: scale(0.3);
      transform: scale(0.3);
      -webkit-animation: moveclouds 17s linear infinite;
      -moz-animation: moveclouds 17s linear infinite;
      -o-animation: moveclouds 17s linear infinite;
    }
    
    .x2 {
        top: 2vw;
      left: 12vw;
      -webkit-transform: scale(0.6);
      -moz-transform: scale(0.6);
      transform: scale(0.6);
      opacity: 0.6;
      -webkit-animation: moveclouds 25s linear infinite;
      -moz-animation: moveclouds 25s linear infinite;
      -o-animation: moveclouds 25s linear infinite;
    }
    
    .x3 {
      left: 12vw;
      bottom: -5.5vw;
    
      -webkit-transform: scale(0.6);
      -moz-transform: scale(0.6);
      transform: scale(0.6);
      opacity: 0.8;
    
      -webkit-animation: moveclouds 25s linear infinite;
      -moz-animation: moveclouds 25s linear infinite;
      -o-animation: moveclouds 25s linear infinite;
    }
    
    .x4 {
      left: 24vw;
      bottom: 3vw;
    
      -webkit-transform: scale(0.75);
      -moz-transform: scale(0.75);
      transform: scale(0.75);
      opacity: 0.75;
    
      -webkit-animation: moveclouds 18s linear infinite;
      -moz-animation: moveclouds 18s linear infinite;
      -o-animation: moveclouds 18s linear infinite;
    }
    
    .x5 {
      left: 11vw;
      top: 14vw;
    
      -webkit-transform: scale(0.5);
      -moz-transform: scale(0.5);
      transform: scale(0.5);
      opacity: 0.8;
    
      -webkit-animation: moveclouds 20s linear infinite;
      -moz-animation: moveclouds 20s linear infinite;
      -o-animation: moveclouds 20s linear infinite;
    }
    
    @-webkit-keyframes moveclouds {
      0% {
        margin-left: 60vw;
      }
      100% {
        margin-left: -60vw;
      }
    }
    @-moz-keyframes moveclouds {
      0% {
        margin-left: 60vw;
      }
      100% {
        margin-left: -60vw;
      }
    }
    @-o-keyframes moveclouds {
      0% {
        margin-left: 60vw;
      }
      100% {
        margin-left: -60vw;
      }
    }
     </style>`;
};
