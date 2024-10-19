document.addEventListener('DOMContentLoaded', () => {
    loadReminders();

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'recordatorio.html';
        });
    }

    setInterval(removeExpiredReminders, 1000 * 60);
});

function loadReminders() {
    displayReminders();
}

function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];

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
        reminderList.appendChild(li);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteReminder(index);
        });
    });

    // Evento para abrir el modal al hacer clic en el botón de editar
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            openModal(index);
        });
    });
}

function deleteReminder(index) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
}

function openModal(index) {
    const modal = document.getElementById('editModal');
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    
    // Rellena el formulario con los datos del recordatorio a editar
    const reminder = reminders[index];
    document.getElementById('editTitle').value = reminder.title;
    document.getElementById('editDate').value = reminder.date;
    document.getElementById('editTime').value = reminder.hour;

    modal.style.display = "block"; // Muestra el modal
    document.getElementById('editReminderForm').dataset.index = index; // Guarda el índice en el formulario
}

// Cierra el modal cuando se hace clic en la "X"
document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = "none";
};

// Manejar el envío del formulario de edición
document.getElementById('editReminderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto

    const index = this.dataset.index; // Obtén el índice del recordatorio
    const title = document.getElementById('editTitle').value;
    const date = document.getElementById('editDate').value;
    const hour = document.getElementById('editTime').value;

    // Actualiza el recordatorio en el almacenamiento local
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders[index] = { title, date, hour };
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Cierra el modal y recarga la lista
    document.getElementById('editModal').style.display = "none";
    displayReminders();
});

function removeExpiredReminders() {
    let reminders = localStorage.getItem('reminders') ? JSON.parse(localStorage.getItem('reminders')) : [];
    const now = new Date();

    reminders = reminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.hour}:00`);
        return reminderDateTime > now;
    });

    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
}

// Obtener el modal
var modal = document.getElementById("editModal");


// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando se abre el modal
function openModal() {
    modal.style.display = "flex"; // Cambiar a "flex" para centrar
}

// Cuando se cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando se hace clic fuera del modal, ciérralo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
