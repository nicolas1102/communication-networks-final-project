var WebsiteUrl;
var WebsiteHostName;

// pide todas las pestañas abiertas y en la misma ventana donde se está actualmente
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //console.log(tabs);
  //chrome.storage.local.clear();

  // guarda la url principal que es en la que está activa
  WebsiteUrl = tabs[0].url;

  // toma la url del sitio principal
  WebsiteHostName = new URL(tabs[0].url).hostname;
  console.log(WebsiteHostName);

  // muestra url en la popup
  document.getElementById("url").innerText = WebsiteHostName;

  // toma todos los url bloqueados en un arreglo
  chrome.storage.local.get("BlockedUrls", (data) => {
    var aux = false;
    if (data.BlockedUrls != undefined) {
      // recorre el arreglo de urls
      data.BlockedUrls.forEach((e, index) => {
        // si encuentra la url y esta está en "BLOCKED"
        if (e.url === WebsiteHostName && e.status === "BLOCKED") {
          aux = true;
        }
      });
    }

    if (aux) {
      // coloca una determinada descripcion del boton aseggun el estado de la url
      document.getElementById("btn").textContent = "UNLOCK THIS URL";
    } else {
      // coloca una determinada descripcion del boton aseggun el estado de la url
      document.getElementById("btn").textContent = "BLOCK THIS URL";
    }
  });
});

// mostrar error en la ventana emergente que eliminara a los tres segundos
function ShowError(text) {
  var div = document.createElement("div");
  div.setAttribute("id", "ERRORcontainer");
  div.innerHTML = `
                <div class="ERROR">
                    <p>${text}</p>     
                </div>`;
  document.getElementsByClassName("bottomItem")[0].appendChild(div);

  setTimeout(() => {
    document.getElementById("ERRORcontainer").remove();
  }, 3000);
}

// agrega un listener a cuando el boton de la popup es preciosnado y seguido de esto se bloquee el host de la pagina
document.getElementById("btn").addEventListener("click", () => {
  // borrar los datos guardados en local
  //chrome.storage.local.clear();

  // verifica si la url de la pestaña que se abre es de chrome, si lo es, envia error que no se puede bloquear la ventana en la popup
  if (WebsiteUrl.toLowerCase().includes("chrome://")) {
    ShowError("You cannot block a chrome URL");
  } else {
    // toma las urls bloqueadas con los datos guardados en local
    chrome.storage.local.get("BlockedUrls", (data) => {
      // si el arreglo recuperado de la local storage está vacio pues agregue algo
      if (data.BlockedUrls === undefined) {
        // guarda en memoria local una variable BlockedUrls que posee dos atributos, status y la el host de url
        chrome.storage.local.set({
          BlockedUrls: [{ status: "BLOCKED", url: WebsiteHostName },],});
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            from: "popup",
            subject: "startBlocking",
          });
        });
        // si el storage no está vacia
        document.getElementById("btn").textContent = "UNLOCK ALL URL'S";
      } else {
        // para verificacion de url bloqueada
        var found = false;
        data.BlockedUrls.forEach((e, index) => {
          if (e.url === WebsiteHostName && e.status === "BLOCKED") {
            // volamos la URL
            var arr = data.BlockedUrls.splice(index, 1);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              // avisamos a content para que restablezca la ventana original
              chrome.tabs.sendMessage(tabs[0].id, {
                from: "popup",
                subject: "unlockPage",
              });
            });
            // restablecemos boton de bloqueo
            document.getElementById("btn").textContent = "BLOCK THIS URL";
            found = true;
            // acturalizamos storage de chrome
            chrome.storage.local.set({ BlockedUrls: [arr], });
          }
        });

        // si no se encontro se agrega
        if (found === false) {
          // guadado de lementos en el storage (gaurdara todas las url que están bloqueadas) ("...data.BlockedUrls" es para que si no se sobreescirba las urls que se quieren bloquear)
          chrome.storage.local.set({
            BlockedUrls: [...data.BlockedUrls, { status: "BLOCKED", url: WebsiteHostName },],
          });

          // envio de mensaje al script para que este inyecte algo al html, esto pidiendo la pestaña que está activa
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              from: "popup",
              subject: "startBlocking",
            });
          });
          document.getElementById("btn").textContent = "UNLOCK ALL URL'S";
        }
      }
    });
  }
});
