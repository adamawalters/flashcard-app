import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouteMatch,
  Link,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import { deleteCard, readDeck } from "../../utils/api";
import DeckTestCard from "./DeckTestCard";
import Study from "./Study";
import EditDeck from "./EditDeck";
import EditCard from "../Card/EditCard";
import AddCard from "../Card/AddCard";

function Deck({ deleteDeckHandler, setDeckRerender }) {
  /*This path: /decks/:deckId */
  /*Deck state is at the deck level - home/layout page shows multiple decks*/
  /*Objective: displays details about the deck as well as each card in the deck,and lets users edit details about the deck, delete the deck, edit the cards, add cards, delete cards */
  /*Deck component has nested routes for: the study, edit, new card, or edit card view */

  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const { url, path } = useRouteMatch();
  const [error, setError] = useState();
  const [deckChildUpdate, setDeckChildUpdate] = useState(false);

  /*Set the deck to the deck fetched from the API - runs when child edits deck, or when deckID parameter changes*/
  useEffect(() => {
    setDeck({});
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const deckFromApi = await readDeck(deckId, abortController.signal);
        setDeck(deckFromApi);
        setDeckRerender((currentValue) => !currentValue);
      } catch (error) {
        if (error.name !== "AbortError") {
          if (error.message.includes("404")) {
            setError(`Deck ID ${deckId} not found`);
          } 
        } else {
          throw error;
        }
      }
    }
    loadDeck();
    return () => abortController.abort();
  }, [deckChildUpdate, deckId, setDeckRerender]);

  /* After user confirmation, update state to new deck without card. Then, make API call to delete card from deck*/
  const deleteCardHandler = (cardIdToDelete) => {
    if (
      window.confirm("Delete this card? You will not be able to recover it.")
    ) {
      /*Create the array of cards without the card to delete and update the state, then make an API call to remove the ID*/
      const cardsWithoutCard = deck.cards.filter(
        (card) => card.id !== cardIdToDelete
      );
      setDeck({ ...deck, cards: cardsWithoutCard });

      /*Update parent index */
      setDeckRerender((currentValue) => !currentValue);

      const abortController = new AbortController();

      async function removeCard() {
        try {
          await deleteCard(cardIdToDelete, abortController.signal);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error.message);
          }
        }
      }
      removeCard();

      return () => abortController.abort();
    }
  };

  if (deck.id) {
    /*This section creates UIs all for cards with the questions & responses */
    /*Create header for the deck view - shows details about the deck, edit, study, and add cards button */
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

    /*Deck component displays the study, edit, new card, or edit card view */

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
          <Study deck={deck} />
        </Route>
        <Route path={`${path}/edit`}>
          <EditDeck
            deck={deck}
            toggleDeckUpdate={setDeckChildUpdate}
            setDeck={setDeck}
          />
        </Route>
        <Route path={`${path}/cards/new`}>
          <AddCard deck={deck} toggleDeckUpdate={setDeckChildUpdate} />
        </Route>
        <Route path={`${path}/cards/:cardId/edit`}>
          <EditCard deck={deck} toggleDeckUpdate={setDeckChildUpdate} />
        </Route>
      </Switch>
    );
  }
  return error ? error : "Loading";
}

export default Deck;
