import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Study from "./Study";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";
import {listDecks, deleteDeck, updateDeck} from "../utils/api/index.js";

function Layout() {

  const [decks, setDecks] = useState([]);

  /* Get DECKS data from the database & set it to the "decks" state. Run this at some frequency tbd*/
  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();

    /*Make API call */
    async function loadDecks() {
      try {
        const decks = await listDecks(abortController.signal)
        setDecks(decks)
      } catch (error) {
        if (error.name !== "AbortError") throw error;
      }
    }

    loadDecks();

    return () => abortController.abort(); /*Clean up function that runs before a new useEffect is called */
  }, []);



/*Deletes deck. Passed to HomeDeckCard buttons */
  const deleteDeckHandler = (deckIdToDelete) => {
    /*Window.confirm 
    
    */
    if(window.confirm(`
    Delete this deck? 

    You will not be able to recover it.`)) {
      //Update decks state
      //Update database with new deleted state for deck
      const abortController = new AbortController()
      const newDecksPostDeletion = decks.filter((deck) => deck.id !== deckIdToDelete)

      /*Abort controller here simply b/c utility API asks for it - not sure how to leverage it */
      deleteDeck(deckIdToDelete, abortController.signal)
      setDecks(newDecksPostDeletion);
      //database call
    }
  }




  /*Returning content to be viewed */
  if (decks) {
    return (
      <>
        <Header />
        <div className="container">
          {/* TODO: Implement the screen starting here */}
          <Switch>
            <Route exact path="/">
              {/*Home needs decks display the decks and to calculate the cardlength. Also needs delete deck handler (used by HomeDeckCard) */}
              <Home decks={decks} deleteDeckHandler={deleteDeckHandler}/>
            </Route>
            <Route path="/decks/:deckId/study">
              <Study />
            </Route>
            <Route path="/decks/new">
              <CreateDeck />
            </Route>
            <Route path="/decks/:deckId/edit">
              <EditDeck />
            </Route>
            <Route path="/decks/:deckId/cards/new">
              <AddCard />
            </Route>
            <Route path="/decks/:deckId/cards/:cardId/edit">
              <EditCard />
            </Route>
            {/*Deck also needs deleteDeckHandler as it displays all the cards as well as an option to delete the deck */}
            <Route path="/decks/:deckId" deleteDeckHandler={deleteDeckHandler}>
              <Deck />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </>
    );
  }
  return "Loading";
}

export default Layout;
