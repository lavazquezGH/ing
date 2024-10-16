document.addEventListener('DOMContentLoaded', () => {
    loadReminders();

    // Manejar el botón de volver a la página de agregar recordatorios
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => {
        window.location.href = 'activo.html'; // Cambia 'index.html' al nombre de tu página principal
    });

    // Limpiar recordatorios expirados cada minuto
    setInterval(removeExpiredReminders, 1000 * 60);
});

function loadReminders() {
    displayReminders();
}

function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

    reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${reminder.title}</span>
            <span>${reminder.date} ${reminder.time}</span>
        `;
        reminderList.appendChild(li);
    });
}

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
