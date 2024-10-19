// Manejo del formulario para agregar recordatorios
document.getElementById('reminderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto de enviar el formulario
    
    // Obtiene los valores ingresados en el formulario
    const title = document.getElementById('title').value;

    if (title.length > 25) {
        alert("El título no puede exceder los 25 caracteres.");
        e.preventDefault(); // Evita que el formulario se envíe si hay un error
    }

    // Obtiene la fecha y la hora ingresadas en el formulario
    const date = document.getElementById('date').value;
    const hour = document.getElementById('time').value;

    // Crea un objeto de recordatorio con los datos del formulario
    const reminder = { title, date, hour };

    // Obtiene los recordatorios existentes de localStorage o crea un arreglo vacío si no hay ninguno
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    // Añade el nuevo recordatorio al arreglo de recordatorios
    reminders.push(reminder);

    // Guarda los recordatorios actualizados en localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Muestra los recordatorios guardados en la consola (para probar codigo)
    //console.log('Recordatorios guardados:', reminders);

    window.location.href = 'activos.html';
});

// Evento que inicializa la eliminación periódica de recordatorios expirados cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html'; // Redirige a la página de agregar recordatorios
        });
    }
    // Ejecuta la limpieza de recordatorios expirados cada minuto
    setInterval(removeExpiredReminders, 1000 * 60);
});

// Función para cargar los recordatorios activos en la página
function loadReminders() {
    displayReminders(); // Llama a la función para mostrar los recordatorios en la interfaz
}

// Muestra los recordatorios almacenados en la interfaz de usuario
function displayReminders() {

    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; // Limpia la lista antes de mostrar los recordatorios

    // Obtiene los recordatorios del localStorage o un arreglo vacío si no hay ninguno
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    // Itera sobre cada recordatorio y lo añade a la lista
    reminders.forEach(reminder => { 
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${reminder.title}</span>
            <span>${reminder.date} ${reminder.hour}</span>
        `;
        reminderList.appendChild(li); // Añade el recordatorio a la lista en la interfaz
    });
}

// Función que elimina los recordatorios que ya han expirado
function removeExpiredReminders() {

    // Obtiene los recordatorios del localStorage o un arreglo vacío si no hay ninguno
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];
    const now = new Date(); // Obtiene la fecha y hora actual

    // Filtra los recordatorios, dejando solo aquellos que no han expirado
    reminders = reminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.hour}:00`);
        return reminderDateTime > now; // Mantiene solo los recordatorios futuros
    });

    // Actualiza los recordatorios en localStorage
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Actualiza la lista de recordatorios en la interfaz
    displayReminders();
}
