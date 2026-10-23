// Elementi della pagina che uso nel codice
const form = document.querySelector(".form-container");
const lista = document.getElementById("lista_abbonamenti");
const bottoneAggiungi = document.getElementById("bottone_aggiungi");
const filtroPrezzo = document.getElementById("selettore_filtro");
const filtroData = document.getElementById("filtro_data");
const campoRicerca = document.getElementById("ciao");
const bottoneTema = document.getElementById("colore_sfondo");

let schedaDaModificare = null;

// Cambia tra tema scuro e tema chiaro
bottoneTema?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// Aggiunge un abbonamento oppure salva le modifiche
bottoneAggiungi?.addEventListener("click", (evento) => {
  evento.preventDefault();

  const abbonamento = {
    id: schedaDaModificare?.dataset.id || creaId(),
    nome: document.getElementById("nome_servizio").value.trim(),
    categoria: document.getElementById("categoria_servizio").value.trim(),
    prezzo: document
      .getElementById("prezzo_servizio")
      .value.trim()
      .replace(",", "."),
    rinnovo: document.getElementById("rinnovo_servizio").value,
    addebito: document.getElementById("addebito_servizio").value.trim()
  };

  if (
    !abbonamento.nome ||
    !abbonamento.categoria ||
    !abbonamento.prezzo ||
    !abbonamento.rinnovo
  ) {
    alert("Compila nome, categoria, prezzo e data di rinnovo.");
    return;
  }

  if (!Number.isFinite(Number(abbonamento.prezzo)) || Number(abbonamento.prezzo) < 0) {
    alert("Inserisci un prezzo valido, per esempio 9.99.");
    return;
  }

  abbonamento.prezzo = Number(abbonamento.prezzo);

  if (schedaDaModificare) {
    mostraAbbonamento(schedaDaModificare, abbonamento);
    schedaDaModificare = null;
    bottoneAggiungi.textContent = "+ Aggiungi";
    mostraMessaggio("Modifica salvata.");
  } else {
    const scheda = document.createElement("div");
    scheda.className = "listacreata";
    mostraAbbonamento(scheda, abbonamento);
    lista.appendChild(scheda);
    mostraMessaggio("Abbonamento aggiunto.");
  }

  form.reset();
  aggiornaPagina();
});

// Crea un ID diverso per ogni abbonamento
function creaId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Mostra i dati dentro una scheda
function mostraAbbonamento(scheda, abbonamento) {
  scheda.dataset.id = abbonamento.id;
  scheda.dataset.nome = abbonamento.nome;
  scheda.dataset.categoria = abbonamento.categoria;
  scheda.dataset.prezzo = String(abbonamento.prezzo);
  scheda.dataset.rinnovo = abbonamento.rinnovo;
  scheda.dataset.addebito = abbonamento.addebito;
  scheda.replaceChildren();

  const informazioni = document.createElement("div");
  informazioni.className = "info-abbonamento";

  const nome = document.createElement("strong");
  nome.className = "titolo-servizio";
  nome.textContent = abbonamento.nome;

  const dettagli = document.createElement("div");
  dettagli.className = "sottotitolo-servizio";
  dettagli.textContent = `${abbonamento.categoria} — rinnovo ${abbonamento.rinnovo}`;

  informazioni.append(nome, dettagli);

  const azioni = document.createElement("div");
  azioni.className = "azioni-abbonamento";

  const prezzo = document.createElement("span");
  prezzo.className = "prezzo-tag";
  prezzo.textContent = `${abbonamento.prezzo}€`;

  const modifica = document.createElement("button");
  modifica.type = "button";
  modifica.className = "btn-azione";
  modifica.textContent = "Modifica";

  const elimina = document.createElement("button");
  elimina.type = "button";
  elimina.className = "btn-azione btn-elimina";
  elimina.textContent = "Elimina";

  azioni.append(prezzo, modifica, elimina);
  scheda.append(informazioni, azioni);
}

// Gestisce i pulsanti Modifica ed Elimina
lista.addEventListener("click", (evento) => {
  const scheda = evento.target.closest(".listacreata");

  if (!scheda) return;

  if (evento.target.closest(".btn-elimina")) {
    scheda.remove();
    aggiornaPagina();
    mostraMessaggio("Abbonamento eliminato.");
    return;
  }

  if (evento.target.closest(".btn-azione")) {
    document.getElementById("nome_servizio").value = scheda.dataset.nome;
    document.getElementById("categoria_servizio").value = scheda.dataset.categoria;
    document.getElementById("prezzo_servizio").value = scheda.dataset.prezzo;
    document.getElementById("rinnovo_servizio").value = scheda.dataset.rinnovo;
    document.getElementById("addebito_servizio").value = scheda.dataset.addebito;

    schedaDaModificare = scheda;
    bottoneAggiungi.textContent = "Salva modifica";
    document.getElementById("nome_servizio").focus();
  }
});

// Aggiorna i risultati mentre scrivi e quando cambi un filtro
function aggiornaRisultati() {
  const parolaCercata = (campoRicerca?.value || "").trim().toLowerCase();
  const prezzoMinimo = Number(filtroPrezzo?.value || 0);
  const sceltaData = filtroData?.value || "tutte";
  const oggi = inizioGiornata(new Date());

  const schede = [...document.querySelectorAll(".listacreata")];
  let risultatiVisibili = 0;

  schede.forEach((scheda) => {
    const nomeECategoria =
      `${scheda.dataset.nome} ${scheda.dataset.categoria}`.toLowerCase();

    const prezzo = Number(scheda.dataset.prezzo);
    const dataRinnovo = leggiData(scheda.dataset.rinnovo);

    const nomeTrovato = nomeECategoria.includes(parolaCercata);
    const prezzoTrovato = prezzoMinimo === 0 || prezzo > prezzoMinimo;
    const dataTrovata = corrispondeAllaData(dataRinnovo, sceltaData, oggi);
    const mostraScheda = nomeTrovato && prezzoTrovato && dataTrovata;

    scheda.style.display = mostraScheda ? "flex" : "none";

    if (mostraScheda) {
      risultatiVisibili++;
    }
  });

  let avviso = lista.querySelector(".nessun-risultato");

  if (
    risultatiVisibili === 0 &&
    (parolaCercata || sceltaData !== "tutte" || prezzoMinimo > 0)
  ) {
    if (!avviso) {
      avviso = document.createElement("p");
      avviso.className = "nessun-risultato";
      lista.appendChild(avviso);
    }

    avviso.textContent = "Nessun abbonamento corrisponde alla ricerca o ai filtri.";
  } else {
    avviso?.remove();
  }
}

// Controlla il filtro scelto nel menu delle date
function corrispondeAllaData(dataRinnovo, scelta, oggi) {
  if (scelta === "tutte") return true;
  if (!dataRinnovo) return false;

  const giorniMancanti = Math.floor((dataRinnovo - oggi) / 86400000);

  if (scelta === "scaduti") return giorniMancanti < 0;
  if (scelta === "7") return giorniMancanti >= 0 && giorniMancanti <= 7;
  if (scelta === "30") return giorniMancanti >= 0 && giorniMancanti <= 30;
  if (scelta === "90") return giorniMancanti >= 0 && giorniMancanti <= 90;

  return true;
}

// Legge la data senza spostarla al giorno precedente
function leggiData(testoData) {
  if (!testoData) return null;

  const [anno, mese, giorno] = testoData.split("-").map(Number);
  return new Date(anno, mese - 1, giorno);
}

function inizioGiornata(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

// La ricerca si aggiorna mentre scrivi
campoRicerca?.addEventListener("input", aggiornaPagina);

// I menu aggiornano i risultati quando li cambi
filtroPrezzo?.addEventListener("change", aggiornaPagina);
filtroData?.addEventListener("change", aggiornaPagina);

// Aggiorna insieme risultati, numeri e barra
function aggiornaPagina() {
  aggiornaRisultati();
  aggiornaRiepilogo();
}

function aggiornaRiepilogo() {
  const abbonamenti = [...document.querySelectorAll(".listacreata")];

  const daAnnullare = abbonamenti.filter((scheda) =>
    scheda.classList.contains("da-annullare")
  ).length;

  const attivi = abbonamenti.length - daAnnullare;

  document.getElementById("num_totale").textContent = abbonamenti.length;
  document.getElementById("num_attivi").textContent = attivi;
  document.getElementById("num_annullare").textContent = daAnnullare;

  const percentuale = abbonamenti.length
    ? (attivi / abbonamenti.length) * 100
    : 0;

  document.getElementById("barra_riempita").style.width = `${percentuale}%`;
}

// Mostra un messaggio dopo un'azione
function mostraMessaggio(testo) {
  let messaggio = document.getElementById("messaggio");

  if (!messaggio) {
    messaggio = document.createElement("p");
    messaggio.id = "messaggio";
    messaggio.setAttribute("role", "status");
    form.after(messaggio);
  }

  messaggio.textContent = testo;
}

// Aggiorna la pagina appena viene aperta
aggiornaPagina();