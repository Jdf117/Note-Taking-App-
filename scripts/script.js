// Get all Notes using button on index page 
document.getElementById('get-notes-button').addEventListener('click', async function(){
    refreshNotes();
});

// Event listener for new note button 
document.getElementById('new-note-button').addEventListener('click', function() {
    clearForm();
    $('#newNoteModal').modal('show'); // Use jQuery to show the modal
});

function clearForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

// Event listener to capture the form submission for new notes
document.getElementById('new-note-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    try {
        const response = await fetch('/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            const newNote = await response.json();
            $('#newNoteModal').modal('hide');
            refreshNotes();
        } else {
            console.error('Failed to add note');
        }
    } catch (err) {
        console.error('Error adding note:', err);
    }
});

// Function to display notes
function displayNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = ''; // Clear the container

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <h7 class="text-secondary">${note.date}</h7>
                    <p class="card-text">${note.content}</p>
                    <button id="update-button-${note.id}" type="button" class="btn btn-primary">Update</button>
                    <button id="delete-button-${note.id}" type="button" class="btn btn-danger delete-button" data-id="${note.id}">Delete</button>
                </div>
            </div>
        `;

        notesContainer.appendChild(card);

        // Add event listener for delete buttons
        const deleteButtons = notesContainer.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        // Add event listener for update buttons
        const updateButtons = notesContainer.querySelectorAll('[id^="update-button-"]');
        updateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const noteId = button.id.split('-').pop();
                openUpdateModal(noteId);
            });
        });
    });
}

// Event handler for delete button clicks
async function handleDelete(event) {
    const noteId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const cardToRemove = event.target.closest('.card');
            if (cardToRemove) {
                cardToRemove.remove();
            }
        } else {
            console.error('Failed to delete note');
        }
    } catch (err) {
        console.error('Error deleting note:', err);
    }
}

// Function to refresh the notes list
async function refreshNotes() {
    try {
        const response = await fetch('/notes');
        if (response.ok) {
            const notes = await response.json();
            displayNotes(notes);
        } else {
            console.error('Failed to fetch notes');
        }
    } catch (err) {
        console.error('Error fetching notes:', err);
    }
}

// Function to open the update modal and populate form fields
function openUpdateModal(noteId) {
    fetch(`/notes/${noteId}`)
        .then(response => response.json())
        .then(note => {
            document.getElementById('update-note-id').value = note._id;
            document.getElementById('update-note-title').value = note.title;
            document.getElementById('update-note-content').value = note.content;
            $('#updateNoteModal').modal('show'); // Use jQuery to show the modal
        })
        .catch(error => console.error('Error fetching note:', error));
}

// Event listener for update form submission
document.getElementById('update-note-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const noteId = document.getElementById('update-note-id').value;
    const title = document.getElementById('update-note-title').value;
    const content = document.getElementById('update-note-content').value;

    try {
        const response = await fetch(`/update-note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            $('#updateNoteModal').modal('hide');
            refreshNotes();
        } else {
            console.error('Failed to update note');
        }
    } catch (err) {
        console.error('Error updating note:', err);
    }
});
