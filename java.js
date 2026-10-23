const bottone = document.querySelector("#colore_sfondo");


bottone.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});







let filtroAttivo = "tutti"; 
let ordina= "tutti"; 
let ricercaCorrente = "";
const elementi = [];


const boottoneaggiungi = document.getElementById("bottone_aggiungi");
const listaabbonamenti = document.getElementById('lista_abbonamenti');


boottoneaggiungi.addEventListener('click', (e) => {
    e.preventDefault();/*non riparte da solo*/


    const nome = document.getElementById('nome_servizio').value;
    const categoria = document.getElementById('categoria_servizio').value;
    const prezzo = document.getElementById('prezzo_servizio').value;
    const rinnovo = document.getElementById('rinnovo_servizio').value;
    const addebito = document.getElementById('addebito_servizio').value;


    if (nome === "" || prezzo === "") {

        alert("inserisci almeno il prezzo e il nome");
        console.log(`ciao`);
        return
    }

    const nuovoabbonamento = { nome, prezzo, categoria, rinnovo, addebito };
    elementi.push(nuovoabbonamento)

    const lista = document.createElement("div");
    lista.classList.add("listacreata")/*qui poi ci collego il css*/





    lista.innerHTML = `

      <div class="info-abbonamento">
        <strong class="titolo-servizio">${nuovoabbonamento.nome}</strong>
        <div class="sottotitolo-servizio">${nuovoabbonamento.categoria} — ${nuovoabbonamento.rinnovo}</div>
      </div>
      <div class="azioni-abbonamento">
        <span class="prezzo-tag">${nuovoabbonamento.prezzo}€</span>
        <button class="btn-azione">Modifica</button>
        <button class="btn-azione btn-elimina">Elimina</button>
      </div>
    `;
   
    const contenitoreLista = document.getElementById('lista_abbonamenti');

    
    contenitoreLista.appendChild(lista);
})


const lista = document.getElementById("#lista_abbonamenti");
const filtro = document.getElementById("#filtro1");
const filtro2 = document.getElementById(`#filtro2`);
const filtro3 = document.getElementById(`#filtro3`);


filtro = document.addEventListener(`clik`, ()=>{
    /*devo prendere il piu grende */
    const prezzo_piu_alto = Math.max(nuovoabbonamento.lista);
    console.log(prezzo_piu_alto)

})





