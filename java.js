const bottone = document.querySelector("#colore_sfondo");


bottone.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});










const elementi = [];

const boottoneaggiungi = document.getElementById("bottone_aggiungi");
const listaabbonamenti = document.getElementById('lista_abbonamenti');

boottoneaggiungi.addEventListener(`click`, function (e) {
    e.preventDefault

    const nome = document.getElementById('nome_servizio').value;
    const categoria = document.getElementById('categoria_servizio').value;
    const prezzo = document.getElementById('prezzo_servizio').value;
    const rinnovo = document.getElementById('rinnovo_servizio').value;
    const addebito = document.getElementById('addebito_servizio').value;


    if (nome === " " || prezzo === " "){
        allert("inserisci almeno il prezzo e il nome");
        return
    }

    const nuovoabbonamento={ nome ,prezzo, categoria ,rinnovo,addebito}
    elementi.push(nuovoabbonamento)


})












