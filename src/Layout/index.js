import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from "./Home/Home.js";
import CreateDeck from "./Home/CreateDeck.js";
import Deck from "./Deck/Deck.js";

import {listDecks, deleteDeck} from "../utils/api/index.js";

function Layout() {

  const [decks, setDecks] = useState([]);
  const history = useHistory();

  /*  Used so children can toggle re-render of deck*/
  const [deckRerender, setDeckRerender] = useState(false);

  /* Get decks data from the database & set it to the "decks" state.*/
  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();

    /*Make API call to load decks data */
    async function loadDecks() {
      try {
        const decks = await listDecks(abortController.signal)
        setDecks(decks)
      } catch (error) {
        if (error.name !== "AbortError") throw error;
      }
    }

    loadDecks();

    return () => abortController.abort(); 
  }, [deckRerender]);



/*Deletes deck after user confirmation. Passed to HomeDeckCard buttons in the "Deck" component*/
  const deleteDeckHandler = async (deckIdToDelete) => {

    if(window.confirm(`Delete this deck? You will not be able to recover it.`)) {

      const newDecksPostDeletion = decks.filter((deck) => deck.id !== deckIdToDelete);
      setDecks(newDecksPostDeletion);
      await deleteDeck(deckIdToDelete);
      setDeckRerender((currentValue)=>!currentValue)
      history.push(`/`);

    }
  }




  /*Layout component returns the Home, CreateDeck, or Decks View after fetching deck data from the API */
  if (decks) {
    return (
      <>
        <Header />
        <div className="container">
          <Switch>
            <Route exact path="/">
              {/*Home needs decks to display the decks and to calculate the cardlength. Also needs delete deck handler (used by HomeDeckCard) */}
              <Home decks={decks} deleteDeckHandler={deleteDeckHandler}/>
            </Route>
            <Route path="/decks/new">
              <CreateDeck setDeckRerender={setDeckRerender}/>
            </Route>
            <Route path="/decks/:deckId">
              {/*Deck also needs deleteDeckHandler as it displays all the cards as well as an option to delete the deck */}
              <Deck deleteDeckHandler={deleteDeckHandler} setDeckRerender={setDeckRerender}/>
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
