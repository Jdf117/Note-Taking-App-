document.getElementById('get-notes-button').addEventListener('click', async function(){
    try{
        const response = await fetch('/notes');
        if(response.ok){
            const notes = await response.json();
            displayNotes(notes);
        } else {
            console.error('Failed to fetch notes');
        }
    } catch (err) {
        console.error('Error fetching notes:', err);
    }
});

function displayNotes(notes){
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = "card";
        noteElement.textContent = note.content;
        notes.Container.appendChild(noteElement);
    });
}

// function displayNotes(notes) {
//     const notesContainer = document.getElementById('notesContainer');
//     notesContainer.innerHTML = '';

//     notes.forEach(note => {
//         const card = document.createElement('div');
//         card.className = 'col-md-4 mb-4';

//         card.innerHTML = `
//             <div class="card">
//                 <div class="card-body">
//                     <h5 class="card-title">${note.title}</h5>
//                     <p class="card-text">${note.content}</p>
//                 </div>
//             </div>
//         `;

//         notesContainer.appendChild(card);
//     });
// }