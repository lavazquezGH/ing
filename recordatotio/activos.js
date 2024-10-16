document.addEventListener('DOMContentLoaded', () => {
    loadReminders();

    // Manejar el botón de volver a la página de agregar recordatorios
    const backBtn = document.getElementById('backBtn');
    if (backBtn) { // Verifica si el botón existe
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html'; // Cambia a la página principal donde se agregan recordatorios
        });
    }

    // Limpiar recordatorios expirados cada minuto
    setInterval(removeExpiredReminders, 1000 * 60);
});

// Función para cargar los recordatorios del almacenamiento local
function loadReminders() {
    displayReminders();
}

// Mostrar los recordatorios activos
function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; // Limpiar la lista antes de volver a cargarla
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    // Mostrar solo los recordatorios activos
    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${reminder.title}</span>
            <span>${reminder.date} ${reminder.time}</span>
            <button class="delete-btn" data-index="${index}">Eliminar</button>
        `;
        reminderList.appendChild(li);
    });

    // Agregar evento de click a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteReminder(index);
        });
    });
}

// Función para eliminar un recordatorio
function deleteReminder(index) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.splice(index, 1); // Eliminar el recordatorio en el índice correspondiente
    localStorage.setItem('reminders', JSON.stringify(reminders)); // Guardar la lista actualizada
    displayReminders(); // Volver a mostrar la lista actualizada
}

// Función para eliminar los recordatorios expirados
function removeExpiredReminders() {
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];
    const now = new Date();

    // Filtrar los recordatorios que aún no han expirado
    reminders = reminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        return reminderDateTime > now;
    });

    // Guardar los recordatorios actualizados en localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Volver a mostrar la lista actualizada
    displayReminders();
}
