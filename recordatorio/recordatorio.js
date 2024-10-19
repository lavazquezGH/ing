// Manejo del formulario para agregar recordatorios
document.getElementById('reminderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto de enviar el formulario
    
    // Obtiene los valores ingresados en el formulario
    const title = document.getElementById('title').value;
    if (title.length > 25) {
        alert("El título no puede exceder los 25 caracteres.");
        e.preventDefault();} // Evita que el formulario se envíe
    ///
    const date = document.getElementById('date').value;
    const hour = document.getElementById('time').value;

    // Crear el objeto de recordatorio
    const reminder = { title, date, hour };

    // Obtener los recordatorios existentes de localStorage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    // Añadir el nuevo recordatorio
    reminders.push(reminder);

    // Guardar los recordatorios actualizados en localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Mostrar los recordatorios guardados en la consola para depuración
    console.log('Recordatorios guardados:', reminders);

    // Redirigir a la página de visualización de recordatorios activos
    window.location.href = 'activos.html';
});

// Evento para inicializar la eliminación periódica de recordatorios expirados
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html'; // Redirigir a la página de agregar
        });
    }

    setInterval(removeExpiredReminders, 1000 * 60); // Ejecuta la limpieza cada minuto
});

// Función para mostrar recordatorios activos
function loadReminders() {
    displayReminders();
}

// Mostrar los recordatorios en la interfaz
function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; // Limpiar la lista

    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    reminders.forEach(reminder => { 
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${reminder.title}</span>
            <span>${reminder.date} ${reminder.hour}</span>
        `;
        reminderList.appendChild(li);
    });
}

// Función para eliminar recordatorios expirados
function removeExpiredReminders() {
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];
    const now = new Date();

    reminders = reminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.hour}:00`);
        return reminderDateTime > now;
    });

    localStorage.setItem('reminders', JSON.stringify(reminders)); // Actualizar localStorage
    displayReminders(); // Actualizar la lista de recordatorios en la interfaz
}
