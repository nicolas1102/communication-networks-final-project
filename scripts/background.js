// recibe mensaje para cerrar la ventana
chrome.runtime.onMessage.addListener((message, sender) => {
    // verifia si el mensaje dice que se cierre es verdadero
    if (message.CloseMe) {
        // cierrra la ventana
        //chrome.tabs.remove(sender.tab.id)
    }
})