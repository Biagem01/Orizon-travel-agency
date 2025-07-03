const API_BASE = '';

        let currentEditType = null;
        let currentEditId = null;

        // Utility functions
        function showMessage(message, type = 'success') {
            const existingMessage = document.querySelector('.status');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `status ${type}`;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('it-IT');
        }

        function formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString('it-IT');
        }

        // API functions
        async function fetchCountries() {
            try {
                const response = await fetch(`${API_BASE}/countries`);
                const data = await response.json();
                if (response.ok) {
                    return data.data;
                } else {
                    throw new Error(data.message || 'Errore nel caricamento paesi');
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
                showMessage('Errore nel caricamento paesi: ' + error.message, 'error');
                return [];
            }
        }

        async function fetchTravels(filters = {}) {
            try {
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) {
                        params.append(key, filters[key]);
                    }
                });
                
                const url = `${API_BASE}/travels${params.toString() ? '?' + params.toString() : ''}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (response.ok) {
                    return data.data;
                } else {
                    throw new Error(data.message || 'Errore nel caricamento viaggi');
                }
            } catch (error) {
                console.error('Error fetching travels:', error);
                showMessage('Errore nel caricamento viaggi: ' + error.message, 'error');
                return [];
            }
        }

        async function createCountry(countryData) {
            try {
                const response = await fetch(`${API_BASE}/countries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(countryData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Paese creato con successo!');
                    return data.data;
                } else {
                    throw new Error(data.message || 'Errore nella creazione del paese');
                }
            } catch (error) {
                console.error('Error creating country:', error);
                showMessage('Errore nella creazione: ' + error.message, 'error');
                return null;
            }
        }

        async function createTravel(travelData) {
            try {
                const response = await fetch(`${API_BASE}/travels`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(travelData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Viaggio creato con successo!');
                    return data.data;
                } else {
                    throw new Error(data.message || 'Errore nella creazione del viaggio');
                }
            } catch (error) {
                console.error('Error creating travel:', error);
                showMessage('Errore nella creazione: ' + error.message, 'error');
                return null;
            }
        }

       async function updateCountry(id, countryData) {
    try {
        const response = await fetch(`${API_BASE}/countries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Paese aggiornato con successo!');
            return data.data;
        } else {
            throw new Error(data.message || 'Errore nell\'aggiornamento del paese');
        }
    } catch (error) {
        console.error('Error updating country:', error);
        showMessage('Errore nell\'aggiornamento: ' + error.message, 'error');
        return null;
    }
}

        async function updateTravel(id, travelData) {
            try {
                const response = await fetch(`${API_BASE}/travels/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(travelData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Viaggio aggiornato con successo!');
                    return data.data;
                } else {
                    throw new Error(data.message || 'Errore nell\'aggiornamento del viaggio');
                }
            } catch (error) {
                console.error('Error updating travel:', error);
                showMessage('Errore nell\'aggiornamento: ' + error.message, 'error');
                return null;
            }
        }

   async function deleteCountry(id) {
    const deleteCountryError = document.getElementById('deleteCountryError');
    const deleteCountrySuccess = document.getElementById('deleteCountrySuccess');

    // Nasconde eventuali messaggi precedenti
    if (deleteCountryError) deleteCountryError.style.display = 'none';
    if (deleteCountrySuccess) deleteCountrySuccess.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/countries/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            if (deleteCountrySuccess) {
                deleteCountrySuccess.textContent = '✅ Paese eliminato con successo!';
                deleteCountrySuccess.style.display = 'block';

                // Nascondi dopo 5 secondi
                setTimeout(() => {
                    deleteCountrySuccess.style.display = 'none';
                }, 5000);
            } else {
                showMessage('Paese eliminato con successo!');
            }

            return true;
        } else {
            const data = await response.json();
            const errorMsg = data.message || 'Errore nell\'eliminazione del paese';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error deleting country:', error);

        if (deleteCountryError) {
            deleteCountryError.textContent = '⚠️ ' + error.message;
            deleteCountryError.style.display = 'block';

            setTimeout(() => {
                deleteCountryError.style.display = 'none';
            }, 5000);
        } else {
            showMessage('Errore: ' + error.message, 'error');
        }

        return false;
    }
}




        async function deleteTravel(id) {
            try {
                const response = await fetch(`${API_BASE}/travels/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showMessage('Viaggio eliminato con successo!');
                    return true;
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Errore nell\'eliminazione del viaggio');
                }
            } catch (error) {
                console.error('Error deleting travel:', error);
                showMessage('Errore nell\'eliminazione: ' + error.message, 'error');
                return false;
            }
        }

        // UI update functions
        function updateCountriesTable(countries) {
            const loading = document.getElementById('countriesLoading');
            const table = document.getElementById('countriesTable');
            const tbody = document.getElementById('countriesTableBody');
            
            loading.style.display = 'none';
            table.style.display = 'table';
            
            tbody.innerHTML = '';
            
            countries.forEach(country => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${country.id}</td>
                    <td>${country.name}</td>
                    <td>${country.travel_count || 0}</td>
                    <td>${formatDateTime(country.created_at)}</td>
                    <td class="action-buttons">
                        <button onclick="editCountry(${country.id}, '${country.name}')">Modifica</button>
                        <button class="btn-danger" onclick="confirmDeleteCountry(${country.id})">Elimina</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function updateTravelsTable(travels) {
            const loading = document.getElementById('travelsLoading');
            const table = document.getElementById('travelsTable');
            const tbody = document.getElementById('travelsTableBody');
            
            loading.style.display = 'none';
            table.style.display = 'table';
            
            tbody.innerHTML = '';
            
            travels.forEach(travel => {
                const row = document.createElement('tr');
                const dateRange = travel.start_date && travel.end_date 
                    ? `${formatDate(travel.start_date)} - ${formatDate(travel.end_date)}`
                    : 'Date non specificate';
                
                row.innerHTML = `
                    <td>${travel.id}</td>
                    <td>${travel.title}</td>
                    <td>${travel.country_name}</td>
                    <td>${travel.seats_available}</td>
                    <td>${travel.price ? '€' + parseFloat(travel.price).toFixed(2) : 'N/A'}</td>
                    <td>${dateRange}</td>
                    <td class="action-buttons">
                        <button onclick="editTravel(${travel.id})">Modifica</button>
                        <button class="btn-danger" onclick="confirmDeleteTravel(${travel.id})">Elimina</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function updateCountrySelects(countries) {
            const travelCountrySelect = document.getElementById('travelCountry');
            const filterCountrySelect = document.getElementById('filterCountry');
            
            // Clear existing options (keep first option)
            travelCountrySelect.innerHTML = '<option value="">Seleziona un paese...</option>';
            filterCountrySelect.innerHTML = '<option value="">Tutti i paesi</option>';
            
            countries.forEach(country => {
                const option1 = document.createElement('option');
                option1.value = country.id;
                option1.textContent = country.name;
                travelCountrySelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = country.id;
                option2.textContent = country.name;
                filterCountrySelect.appendChild(option2);
            });
        }

        // Edit functions
        function editCountry(id, name) {
            currentEditType = 'country';
            currentEditId = id;
            
            document.getElementById('modalTitle').textContent = 'Modifica Paese';
            document.getElementById('editFormContent').innerHTML = `
                <div class="form-group">
                    <label for="editCountryName">Nome Paese</label>
                    <input type="text" id="editCountryName" name="name" value="${name}" required>
                </div>
            `;
            
            document.getElementById('editModal').style.display = 'block';

            
        }

        async function editTravel(id) {
            currentEditType = 'travel';
            currentEditId = id;
            
            try {
                const response = await fetch(`${API_BASE}/travels/${id}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Errore nel caricamento del viaggio');
                }
                
                const travel = data.data;
                const countries = await fetchCountries();
                
                let countryOptions = '';
                countries.forEach(country => {
                    const selected = country.id == travel.country_id ? 'selected' : '';
                    countryOptions += `<option value="${country.id}" ${selected}>${country.name}</option>`;
                });
                
                document.getElementById('modalTitle').textContent = 'Modifica Viaggio';
                document.getElementById('editFormContent').innerHTML = `
                    <div class="form-group">
                        <label for="editTravelCountry">Paese</label>
                        <select id="editTravelCountry" name="country_id" required>
                            ${countryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editTravelTitle">Titolo Viaggio</label>
                        <input type="text" id="editTravelTitle" name="title" value="${travel.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="editTravelDescription">Descrizione</label>
                        <textarea id="editTravelDescription" name="description">${travel.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editTravelSeats">Posti Disponibili</label>
                        <input type="number" id="editTravelSeats" name="seats_available" value="${travel.seats_available}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editTravelPrice">Prezzo (€)</label>
                        <input type="number" id="editTravelPrice" name="price" value="${travel.price || ''}" step="0.01" min="0">
                    </div>
                    <div class="form-group">
                        <label for="editTravelStartDate">Data Inizio</label>
                        <input type="date" id="editTravelStartDate" name="start_date" value="${travel.start_date || ''}">
                    </div>
                    <div class="form-group">
                        <label for="editTravelEndDate">Data Fine</label>
                        <input type="date" id="editTravelEndDate" name="end_date" value="${travel.end_date || ''}">
                    </div>
                `;
                
                document.getElementById('editModal').style.display = 'block';
                
            } catch (error) {
                console.error('Error loading travel for edit:', error);
                showMessage('Errore nel caricamento: ' + error.message, 'error');
            }
        }

        // Delete confirmation functions
        function confirmDeleteCountry(id) {
            if (confirm('Sei sicuro di voler eliminare questo paese? Questa azione non può essere annullata.')) {
                deleteCountry(id).then(success => {
                    if (success) {
                        loadData();
                    }
                });
            }
        }

        function confirmDeleteTravel(id) {
            if (confirm('Sei sicuro di voler eliminare questo viaggio? Questa azione non può essere annullata.')) {
                deleteTravel(id).then(success => {
                    if (success) {
                        loadData();
                    }
                });
            }
        }

        // Data loading function
        async function loadData() {
            const countries = await fetchCountries();
            const travels = await fetchTravels(getCurrentFilters());
            
            updateCountriesTable(countries);
            updateTravelsTable(travels);
            updateCountrySelects(countries);
        }

        function getCurrentFilters() {
            const filters = {};
            
            const countryFilter = document.getElementById('filterCountry').value;
            if (countryFilter) filters.country_id = countryFilter;
            
            const seatsFilter = document.getElementById('filterSeats').value;
            if (seatsFilter) filters.seats_available = seatsFilter;
            
            const sortFilter = document.getElementById('filterSort').value;
            if (sortFilter) filters.sort = sortFilter;
            
            return filters;
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            loadData();

            // Country form
            document.getElementById('countryForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const countryData = Object.fromEntries(formData);
                
                const result = await createCountry(countryData);
                if (result) {
                    this.reset();
                    loadData();
                }
            });

            // Travel form
            document.getElementById('travelForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const travelData = Object.fromEntries(formData);
                
                // Convert numeric fields
                travelData.country_id = parseInt(travelData.country_id);
                travelData.seats_available = parseInt(travelData.seats_available);
                if (travelData.price) {
                    travelData.price = parseFloat(travelData.price);
                }
                
                const result = await createTravel(travelData);
                if (result) {
                    this.reset();
                    loadData();
                }
            });

            // Edit form
            document.getElementById('editForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                let result = null;
                
                if (currentEditType === 'country') {
                    result = await updateCountry(currentEditId, data);
                } else if (currentEditType === 'travel') {
                    // Convert numeric fields
                    data.country_id = parseInt(data.country_id);
                    data.seats_available = parseInt(data.seats_available);
                    if (data.price) {
                        data.price = parseFloat(data.price);
                    }
                    result = await updateTravel(currentEditId, data);
                }
                
                if (result) {
                    document.getElementById('editModal').style.display = 'none';
                    loadData();
                }
            });

            // Clear forms
            document.getElementById('clearCountryForm').addEventListener('click', function() {
                document.getElementById('countryForm').reset();
            });

            document.getElementById('clearTravelForm').addEventListener('click', function() {
                document.getElementById('travelForm').reset();
            });

            // Filters
            document.getElementById('applyFilters').addEventListener('click', function() {
                loadData();
            });

            document.getElementById('clearFilters').addEventListener('click', function() {
                document.getElementById('filterCountry').value = '';
                document.getElementById('filterSeats').value = '';
                document.getElementById('filterSort').value = '';
                loadData();
            });

            // Modal controls
            document.querySelector('.close').addEventListener('click', function() {
                document.getElementById('editModal').style.display = 'none';
            });

            document.getElementById('cancelEdit').addEventListener('click', function() {
                document.getElementById('editModal').style.display = 'none';
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('editModal');
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });