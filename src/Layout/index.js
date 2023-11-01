import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from "./Home";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";

import {listDecks, deleteDeck} from "../utils/api/index.js";

function Layout() {

  const [decks, setDecks] = useState([]);
  const history = useHistory();

  /* used so children can toggle re-render of deck*/
  const [deckRerender, setDeckRerender] = useState(false);

  /* Get DECKS data from the database & set it to the "decks" state.*/
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
  }, [deckRerender]);



/*Deletes deck after user confirmation. Passed to HomeDeckCard buttons */
  const deleteDeckHandler = async (deckIdToDelete) => {

    if(window.confirm(`Delete this deck? You will not be able to recover it.`)) {

      /*create new deck array without the deck to be deleted  */
      const newDecksPostDeletion = decks.filter((deck) => deck.id !== deckIdToDelete);

      /*set state to the new state array post deletion */
      setDecks(newDecksPostDeletion);

      /*Abort controller here simply b/c utility API asks for it - not sure how to leverage it */
      /* deletes deck from database using API call*/
      const abortController = new AbortController();
      await deleteDeck(deckIdToDelete, abortController.signal);
      setDeckRerender((currentValue)=>!currentValue)
      history.push(`/`);

    }
  }




  /*Returning content to be viewed, after decks is loaded from API*/
  if (decks) {
    return (
      <>
        <Header />
        <div className="container">
          <Switch>
            <Route exact path="/">
              {/*Home needs decks display the decks and to calculate the cardlength. Also needs delete deck handler (used by HomeDeckCard) */}
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
