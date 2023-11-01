import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouteMatch,
  Link,
  Switch, 
  Route
} from "react-router-dom/cjs/react-router-dom.min";
import { deleteCard, readDeck } from "../utils/api";
import DeckTestCard from "./DeckTestCard";
import Study from "./Study";
import EditDeck from "./EditDeck";
import EditCard from "./EditCard";

function Deck({ deleteDeckHandler, setDeckRerender }) {
  /*This path: /decks/:deckId */
  /*Deck state should be at the deck level - home/layout page shows multiple decks*/
  /*Objective: displays details about the deck as well as each card in the deck,and lets users edit details about the deck, delete the deck, edit the cards, add cards, delete cards */

  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const { url, path } = useRouteMatch();
  const [deckChildUpdate, setDeckChildUpdate] = useState(false);

  /*Set the deck to the deck fetched from the API. Re-usable function for EditCard*/

  /*Set the deck to the deck fetched from the API - runs when child edits deck, or when deckID parameter changes*/
  useEffect(() => {

    const readDeckFromAPI = () => {
      setDeck({});
      const abortController = new AbortController();
  
      async function loadDeck() {
        try {
          const deckFromApi = await readDeck(deckId, abortController.signal);
          setDeck(deckFromApi);
  
          /*Makes parent (index) re-render */
          setDeckRerender((currentValue) => !currentValue);
        } catch (error) {
          if (error.name !== "AbortError") {
            if(error.message === "404 - Not Found") {
              alert("Not found")
            }
            //re error;
          }
        }
      }
      loadDeck();
      return () => abortController.abort();
    };

    readDeckFromAPI();
  }, [deckChildUpdate, deckId, setDeckRerender]);

  /* After user confirmation, update state to new deck without card. Then, make API call to delete card from deck*/
  const deleteCardHandler = (cardIdToDelete) => {
    if (
      window.confirm("Delete this card? You will not be able to recover it.")
    ) {
      /*Create the array of cards without the card to delete */
      const cardsWithoutCard = deck.cards.filter(
        (card) => card.id !== cardIdToDelete
      );
      /*Set deck state to the current deck with the updated cards array without the deleted card */
      setDeck({ ...deck, cards: cardsWithoutCard });

      /*Update parent index */
      setDeckRerender((currentValue)=> !currentValue)

      const abortController = new AbortController();

      /*Remove card from the database via API call */
      async function removeCard() {
        try {
          await deleteCard(cardIdToDelete, abortController.signal);
        } catch (error) {
          if (error.name !== "AbortError") {
            throw error;
          }
        }
      }
      removeCard();

      return () => abortController.abort();
    }
  };

  /*If the API call has updated the deck to a deck from the API (therefore it has an id key) - display the deck */
  if (deck.id) {
    /*This section creates UIs all for cards with the questions & responses */

    /*Create header for the deck view - shows details about the deck */
    const deckHeader = (
      <div className="card border-0">
        <div className="card-body px-0">
          <h5 className="card-title">{deck.name}</h5>
          <p className="card-text">{deck.description}</p>
          <div className="card-wrapper">
            <button className="card-btn btn btn-secondary">
              {
                <Link className="text-reset" to={`${url}/edit`}>
                  Edit
                </Link>
              }
            </button>
            <button className="card-btn btn btn-primary">
              {
                <Link className="text-reset" to={`${url}/study`}>
                  Study
                </Link>
              }
            </button>
            <button className="card-btn btn btn-primary">
              {
                <Link className="text-reset" to={`${url}/cards/new`}>
                  +Add Cards
                </Link>
              }
            </button>
            <button
              className="card-btn btn btn-danger"
              onClick={() => deleteDeckHandler(deckId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    const breadcrumb = (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
        </ol>
      </nav>
    );

    /*Create the view for each card (with both front & back to shown on the test view) */
    const deckTestCards = deck.cards.map((card) => {
      return (
        <DeckTestCard
          key={card.id}
          cardId={card.id}
          front={card.front}
          back={card.back}
          deleteCardHandler={deleteCardHandler}
        />
      );
    });

    return (
      <Switch>
        <Route exact path={`${path}`}>
          <main>
            {breadcrumb}
            {deckHeader}
            <h1>Cards</h1>
            {deckTestCards}
          </main>
        </Route>
        <Route path={`${path}/study`}>
          <Study deck={deck}/>
        </Route>
        <Route path={`${path}/edit`}>
          <EditDeck deck={deck} toggleDeckUpdate={setDeckChildUpdate} setDeck={setDeck}/>
        </Route>
        <Route path={`${path}/cards/new`}>
          <EditCard deck={deck} toggleDeckUpdate={setDeckChildUpdate} edit={false}/>
        </Route>
        <Route path={`${path}/cards/:cardId/edit`}>
          <EditCard deck={deck} toggleDeckUpdate={setDeckChildUpdate} edit={true}/>
        </Route>
      </Switch>
    );
  }
  return "Loading";
}

export default Deck;
