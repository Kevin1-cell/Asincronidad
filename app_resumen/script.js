const llave = "AIzaSyDHLBU37wd39aAKMc9e2a4CPHGiCa-zqYw";

async function resumirTextos(){
    let tope = 3;
    let promesas = [];
    for (let index = 1; index <= tope; index++) {
        const texto = obtenerTextoPorNumero(index);
        const promesa = resumirTexto(texto,llave);
        promesas.push(promesa)
    }

    const resumenes = await Promise.all(promesas)
    cambiarTextoResumen(resumenes);
}

function obtenerTextoPorNumero (numero){
    return document.getElementById(`text_${numero}`).value;
}

function cambiarTextoResumen (resumenes){
    resumenes.forEach((resumen,index )=> {
        const textArea = document.getElementById(`resumen_${index + 1}`);
        textArea.value = resumen
    });
}

async function resumirTexto (texto,llave) {
    let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${llave}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Quiero que me resuman este texto de la manera mas corta posible, aqui el texto: ${texto}` }
            ]
          }]
        })
      })

      if(res.status !== 200){
        return "Errror resumiendo el texto"
      }

      let JSONresum = await res.json();

      let resumen = JSONresum.candidates[0].content.parts[0].text;

      return resumen;
}