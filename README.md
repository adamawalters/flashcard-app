# Flashcard App

This is an app that lets students and teachers create and update flashcards for use as a study tool. 

## Structure

1. The "Index" component makes the initial call to load decks from a JSON server and stores it in state
2. Index routes to either the Home screen (which displays the list of decks) or the decks screen (which displays cards within decks)
3. Users can view decks, edit the description, and view, edit and add cards to decks. This is maintained in state while updating the form, and then is updated in the JSON server
4. There is a study view where users can go through cards in decks one by one

## Nested Routing
The Index screen contains the following components:
1. Home (default view)
2. Decks

The Decks screen contains the following components: 
1. Deck (default view)
2. Study
3. Add Card
4. Edit Card


The Add/Edit Cards share the "CardForm" component but use different event handlers for submission. 
