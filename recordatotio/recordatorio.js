// Manejo del formulario para agregar recordatorios
document.getElementById('reminderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const hour = document.getElementById('time').value;

    // Crear un objeto recordatorio
    const recordatorio = { title, date, hour };

    // Obtener los recordatorios existentes en LocalStorage
    let recordatorios = JSON.parse(localStorage.getItem('reminders')) || [];

    // Agregar el nuevo recordatorio
    recordatorios.push(recordatorio);

    // Guardar los recordatorios actualizados en LocalStorage
    localStorage.setItem('reminders', JSON.stringify(recordatorios));

    // Mostrar el contenido actual de localStorage en la consola
    console.log('Recordatorios guardados:', JSON.parse(localStorage.getItem('reminders')));

    // Redirigir a la página de visualización
    window.location.href = 'activos.html';
});

document.addEventListener('DOMContentLoaded', () => {
    // Manejar el botón de volver a la página de agregar recordatorios
    const backBtn = document.getElementById('backBtn');
    if (backBtn) { // Verifica si el botón existe
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html';
        });
    }

    // Limpiar recordatorios expirados cada minuto
    setInterval(removeExpiredReminders, 1000 * 60);
});

// Inicializa o carga los recordatorios guardados.
function loadReminders() {
    displayReminders();
}

// Muestra los recordatorios en la interfaz. Se delega la tarea a la siguiente función.
function displayReminders() {
    // Se obtiene el elemento del DOM con el id reminderList
    const reminderList = document.getElementById('reminderList');
    
    // Se vacía el contenido actual de la lista
    reminderList.innerHTML = '';

    // Se verifica si existe algún valor guardado en localStorage bajo la clave 'reminders'.
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    // Itera sobre cada recordatorio en el array reminders
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
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`); 
        return reminderDateTime > now;
    });

    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
}
