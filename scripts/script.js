//Get all Notes using button on index page 
document.getElementById('get-notes-button').addEventListener('click', async function(){

    refreshNotes();
});

//event listener for new note button 
// creates a modal 
document.getElementById('new-note-button').addEventListener('click', function() {
    console.log("modal up!")
    clearForm();
    $('#newNoteModal').modal('show'); 
});

function clearForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

//Event listen to capture the form submission
document.getElementById('new-note-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    // Debugging: Check the collected values
    console.log(`Title: ${title}, Content: ${content}`);

    try {
        const response = await fetch('/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            const newNoteText = await response.json();
            console.log('New note added:', newNote);

            // Optionally close the modal
            $('#newNoteModal').modal('hide');

            console.log("refreshing notes")
            // Refresh the list of notes
            refreshNotes();
            console.log("note refreshed")
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
    console.log("Notes container cleared and ready for new notes.");

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
        console.log(`Card for note ${note.id} added.`); 
    });

    // Add event listener for delete buttons
    const deleteButtons = notesContainer.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
        console.log(`Event listener attached to ${button.id}`); 
    });

   
}

// Event handler for delete button clicks
async function handleDelete(event) {
    console.log("Delete event triggered."); 
    const noteId = event.target.getAttribute('data-id');
    console.log(`Deleting note with ID: ${noteId}`); 
    try{
        console.log("try event")
        const response = await fetch(`/notes/${noteId}`, {
            method: 'DELETE'
        });
        console.log(response);
        if(response.ok){
            console.log(`Note ${noteId} deleted successfully`);
            const cardToRemove = event.target.closest('.card');
                if (cardToRemove) {
                    cardToRemove.remove();
                    console.log(`Card for note ${noteId} removed from the screen`);
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
            console.log(notes); 
            displayNotes(notes);
        } else {
            console.error('Failed to fetch notes');
        }
    } catch (err) {
        console.error('Error fetching notes:', err);
    }
}