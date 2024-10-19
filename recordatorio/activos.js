// Evento que se ejecuta cuando el contenido del DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadReminders(); // Carga los recordatorios almacenados en la página

    // Configura el botón de "volver" si existe
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html'; // Redirige a la página de agregar recordatorios
        });
    }

    // Inicia la eliminación periódica de recordatorios expirados cada minuto
    setInterval(removeExpiredReminders, 1000 * 60);
});

// Función que carga los recordatorios
function loadReminders() {
    displayReminders(); // Muestra los recordatorios en la interfaz
}

// Función para mostrar los recordatorios almacenados en la página
function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; // Limpia la lista de recordatorios anteriores

    // Recupera los recordatorios del localStorage
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    // Crea y agrega cada recordatorio a la lista
    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${reminder.title}</span>
            <span>${reminder.date} ${reminder.hour}</span>
            <div class="btnGroup">
            <button class="editBtn" data-index="${index}">✏️</button>
            <button class="deleteBtn" data-index="${index}">🗑️</button>
            </div>
        `;
        reminderList.appendChild(li); // Añade el recordatorio a la lista

        // Añade evento de eliminación a los botones de eliminar
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteReminder(index); // Llama a la función para eliminar el recordatorio
            });
        });

        // Añade evento de edición a los botones de editar
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                openModal(index); // Abre el modal de edición para el recordatorio seleccionado
            });
        });
    });
}

// Función para eliminar un recordatorio de la lista y del localStorage
function deleteReminder(index) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.splice(index, 1); // Elimina el recordatorio en la posición indicada
    localStorage.setItem('reminders', JSON.stringify(reminders)); // Actualiza el localStorage
    displayReminders(); // Recarga la lista de recordatorios en la interfaz
}

// Función para abrir el modal de edición y rellenar el formulario con los datos del recordatorio seleccionado
function openModal(index) {
    const modal = document.getElementById('editModal');
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    
    // Rellena el formulario con los datos actuales del recordatorio
    const reminder = reminders[index];
    document.getElementById('editTitle').value = reminder.title;
    document.getElementById('editDate').value = reminder.date;
    document.getElementById('editTime').value = reminder.hour;

    modal.style.display = "block"; // Muestra el modal
    document.getElementById('editReminderForm').dataset.index = index; // Guarda el índice del recordatorio a editar
}


// Maneja el evento de envio del formulario de edición
document.getElementById('editReminderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    const index = this.dataset.index; // Obtén el índice del recordatorio a editar
    const title = document.getElementById('editTitle').value; // Título actualizado
    const date = document.getElementById('editDate').value; // Fecha actualizada
    const hour = document.getElementById('editTime').value; // Hora actualizada

    // Actualiza el recordatorio en el localStorage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders[index] = { title, date, hour }; // Modifica el recordatorio
    localStorage.setItem('reminders', JSON.stringify(reminders)); // Guarda los cambios en el localStorage

    document.getElementById('editModal').style.display = "none";
    displayReminders();
});

// Función que elimina los recordatorios que ya han expirado
function removeExpiredReminders() {
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];
    const now = new Date(); // Obtiene la fecha y hora actual

    // Filtra los recordatorios que no han expirado
    reminders = reminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.hour}:00`);
        return reminderDateTime > now; // Mantiene los recordatorios que aún no han expirado
    });

    localStorage.setItem('reminders', JSON.stringify(reminders)); 
    displayReminders();
}

var modal = document.getElementById("editModal");

function openModal() {
    modal.style.display = "flex"; // Cambiar a "flex" para centrar el modal
}

// Evento que cierra el modal cuando se hace clic en la "X"
document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = "none"; // Oculta el modal
};

// Cierra el modal si se hace click por fuera
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
