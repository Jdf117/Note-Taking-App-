Hi Yashi, this is my note taking app.

Dependencies required to run the app:

- ejs
- express
- express-openid-connect
- mongoose
- nodemon

App purpose:
To allow users to store and edit personal notes. Notes are created and stored in the MongoDB database which can be accessed by performing CRUD operations.

Operations:

- Create: Users can create new notes by filling out a form with title and content.
- Read: Users can view all their notes in a card deck
- Update: Users can update their code using the UI presented at the URL: http://localhost:3000
- Delete: Users can delete their notes by clicking on the delete button that is located on each card

Details about the app:

All crud operations work via postman
Buttons that work are: 
- Get notes - refreshes the list and displays all existing notes in the form of cards 
- New notes - brings up a modal window and lets the user create a new note by filling out a form 
- Delete notes - deletes the note card and updates on screen

stuff that's kinda broken: 
- update button - will not bring up modal. Could not fix in time unfortunately 
- creating a new note has a bug - modal window won't disappear on its own. - Authentication unfortunately was not implemented due to time contraints.

I've left the other branches because they contain notes and comments and the authentication feature that works but was not implemented.

Master branch has everything except auth0 or comments Test branch has the auth 0 implemented but does not have most of the UI done. Notes branch - has the same code as master branch but with additional comments.
