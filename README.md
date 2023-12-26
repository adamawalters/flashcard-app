# FlipFlash - Flashcard App

This is a web app that lets students and teachers create and update flashcards for use as a study tool. It is deployed [on Vercel](https://flashcard-app-wine-nine.vercel.app/). Please note - _the server may take a minute to boot up_. 

The front-end is created using React (leveraging React Router) and the flashcard data is stored in a JSON server. The front-end sends CRUD requests to the server to create, update, and delete decks and flashcards within the decs. 

The styling utilizes CSS Bootstrap and some custom CSS. 

## Structure

1. All components are stored in the src/Layout folder
2. The "Index" component makes the initial call to load decks from a JSON server and stores it in state
3. Index routes to either the Home screen (which displays the list of decks) or the decks screen (which displays cards within decks)
4. Users can view decks, edit the description, and view, edit and add cards to decks. This is maintained in state while updating the form, and then is updated in the JSON server
5. There is a study view where users can go through cards in decks one by one

## Nested Routing
The Index screen contains the following nested components:
1. Home (default view)
2. Decks
3. Not Found
4. Header (present above all routes)

The Decks screen contains the following nested components: 
1. Deck (default view): contains "Deck Test Card" component
2. Study 
4. Add Card: contains CardForm component
5. Edit Card: contains the CardForm Component
6. The Add/Edit Cards share the "CardForm" component but use different event handlers for submission. 


The Home screen contains the following components:
1. HomeDeckCard

## Backend
1. The backend is a simple JSON server



