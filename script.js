// Variabili globali
let currentOperation = null;
let editOperation = null;

// Carica le date salvate o imposta quelle iniziali
let waterDate = new Date(localStorage.getItem('waterDate') || new Date());
let fertilizeDate = new Date(localStorage.getItem('fertilizeDate') || new Date());
let pruneDate = new Date(localStorage.getItem('pruneDate') || new Date());
let cuttingDate = new Date(localStorage.getItem('cuttingDate') || new Date());
let harvestDate = new Date(localStorage.getItem('harvestDate') || new Date());

// Imposta le date iniziali con intervalli corretti
if (!localStorage.getItem('waterDate')) waterDate.setDate(waterDate.getDate() + 3); // Innaffiatura ogni 3 giorni
if (!localStorage.getItem('fertilizeDate')) fertilizeDate.setDate(fertilizeDate.getDate() + 30); // Concimazione ogni 30 giorni
if (!localStorage.getItem('pruneDate')) pruneDate.setDate(pruneDate.getDate() + 180); // Potatura ogni 6 mesi
if (!localStorage.getItem('cuttingDate')) cuttingDate.setDate(cuttingDate.getDate() + 365); // Talee ogni anno
if (!localStorage.getItem('harvestDate')) harvestDate.setDate(harvestDate.getDate() + 90); // Raccolta ogni 3 mesi

// Funzione per formattare la data
function formatDate(date) {
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Aggiorna le date nella pagina
function updateDates() {
  document.getElementById('water-date').textContent = formatDate(waterDate);
  document.getElementById('fertilize-date').textContent = formatDate(fertilizeDate);
  document.getElementById('prune-date').textContent = formatDate(pruneDate);
  document.getElementById('cutting-date').textContent = formatDate(cuttingDate);
  document.getElementById('harvest-date').textContent = formatDate(harvestDate);
}

// Salva le date nel localStorage
function saveDates() {
  localStorage.setItem('waterDate', waterDate);
  localStorage.setItem('fertilizeDate', fertilizeDate);
  localStorage.setItem('pruneDate', pruneDate);
  localStorage.setItem('cuttingDate', cuttingDate);
  localStorage.setItem('harvestDate', harvestDate);
}

// Mostra il popup di conferma
function confirmAction(operation) {
  currentOperation = operation;
  document.getElementById('confirm-popup').style.display = 'flex';
}

// Chiudi il popup di conferma
function closeConfirmPopup() {
  document.getElementById('confirm-popup').style.display = 'none';
}

// Conferma l'operazione
function confirmOperation() {
  if (currentOperation === 'water') resetWatering();
  else if (currentOperation === 'fertilize') resetFertilizing();
  else if (currentOperation === 'prune') resetPruning();
  else if (currentOperation === 'cutting') resetCutting();
  else if (currentOperation === 'harvest') resetHarvest();
  closeConfirmPopup(); // Chiudi il popup dopo la conferma
}

// Apri il modal per modificare la data
function openEditModal(operation) {
  editOperation = operation;
  let currentDate;
  if (operation === 'water') currentDate = waterDate;
  else if (operation === 'fertilize') currentDate = fertilizeDate;
  else if (operation === 'prune') currentDate = pruneDate;
  else if (operation === 'cutting') currentDate = cuttingDate;
  else if (operation === 'harvest') currentDate = harvestDate;

  // Imposta la data corrente nel campo di input
  document.getElementById('edit-date-input').value = currentDate.toISOString().split('T')[0];
  document.getElementById('edit-modal').style.display = 'flex';
}

// Chiudi il modal di modifica
function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

// Salva la data modificata
function saveEditedDate() {
  const newDate = new Date(document.getElementById('edit-date-input').value);
  if (editOperation === 'water') waterDate = newDate;
  else if (editOperation === 'fertilize') fertilizeDate = newDate;
  else if (editOperation === 'prune') pruneDate = newDate;
  else if (editOperation === 'cutting') cuttingDate = newDate;
  else if (editOperation === 'harvest') harvestDate = newDate;
  saveDates();
  updateDates();
  closeEditModal();
}

// Funzioni per resettare le date
function resetWatering() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 3); // Ogni 3 giorni
  waterDate = newDate;
  saveDates();
  updateDates();
  showNotification("Innaffiatura completata! Prossima innaffiatura: " + formatDate(waterDate));
}

function resetFertilizing() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 30); // Ogni 30 giorni
  fertilizeDate = newDate;
  saveDates();
  updateDates();
  showNotification("Concimazione completata! Prossima concimazione: " + formatDate(fertilizeDate));
}

function resetPruning() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 180); // Ogni 6 mesi
  pruneDate = newDate;
  saveDates();
  updateDates();
  showNotification("Potatura completata! Prossima potatura: " + formatDate(pruneDate));
}

function resetCutting() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 365); // Ogni anno
  cuttingDate = newDate;
  saveDates();
  updateDates();
  showNotification("Talee completate! Prossime talee: " + formatDate(cuttingDate));
}

function resetHarvest() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 90); // Ogni 3 mesi
  harvestDate = newDate;
  saveDates();
  updateDates();
  showNotification("Raccolta completata! Prossima raccolta: " + formatDate(harvestDate));
}

// Mostra una notifica del browser
function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("Gestione Piante di Limone", { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Gestione Piante di Limone", { body: message });
      }
    });
  }
}

// Inizializza le date all'avvio
updateDates();

// Richiedi il permesso per le notifiche
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Controlla periodicamente se è il momento di agire
setInterval(checkForActions, 60 * 60 * 1000); // Controlla ogni ora