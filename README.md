## 🌍 Orizon Travel Agency
Orizon è una web application progettata per la gestione di viaggi e destinazioni turistiche. Realizzata come progetto accademico, ha l'obiettivo di fornire un'interfaccia CRUD (Create, Read, Update, Delete) per gestire Paesi e Viaggi collegati, utilizzando PHP (con PDO), MySQL e Fetch API via JavaScript per comunicare tra frontend e backend.

# 🚀 Funzionalità Principali
Gestione Paesi: Aggiungi, modifica o elimina paesi dal database.

Gestione Viaggi: Associa viaggi ai paesi, includendo nome, descrizione, durata, prezzo.

Interfaccia dinamica: Il frontend aggiorna automaticamente le liste di paesi e viaggi senza ricaricare la pagina.

Comunicazione asincrona: Tutte le operazioni sono gestite tramite Fetch API e risposte JSON.

Validazione server-side: I dati ricevuti vengono sempre validati prima di essere inseriti nel database.

Organizzazione modulare del backend: Codice backend suddiviso in file PHP distinti per responsabilità (paesi, viaggi, connessione, ecc.).

# Tecnologie Utilizzate

| Livello       | Stack                                     |
| ------------- | ----------------------------------------- |
| **Frontend**  | HTML5, CSS, Vanilla JavaScript            |
| **Backend**   | PHP (senza framework)                     |
| **Database**  | MySQL                                     |      ||
| **Local Dev** | MAMP (Apache + MySQL + PHP)               |



# ⚙️ Setup e Avvio del Progetto
# Prerequisiti
- MAMP (o XAMPP simile)
- Composer
- Git

# Installazione
Clona la repository:
- git clone https://github.com/Biagem01/Orizon.git
Sposta il progetto nella cartella MAMP:
- mv Orizon /Applications/MAMP/htdocs/
- imposta la Document Root di Mamp in : Applications › MAMP › htdocs › Orizon-main › public

# Installa le dipendenze:

- composer install

- Avvia il server MAMP e accedi da http://localhost:8888/

### 🧠 Descrizione

**Orizon Travel Agency** è un'applicazione web progettata per aiutare agenzie di viaggio a gestire facilmente **paesi** e **viaggi turistici**, con funzionalità CRUD (Create, Read, Update, Delete) sia per paesi che per viaggi.

Il progetto è composto da:
- Un **frontend dinamico** in HTML + JavaScript.
- Un **backend in PHP** che gestisce API REST personalizzate.
- Un **database MySQL** per la memorizzazione dei dati.

Il progetto è stato sviluppato da Biagio, studente di informatica, con l'obiettivo di mettere in pratica concetti di sviluppo full stack.


