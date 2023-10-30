import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouteMatch,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { deleteCard, readDeck, updateDeck } from "../utils/api";
import DeckTestCard from "./DeckTestCard";

function Deck({ deleteDeckHandler }) {
  /*This path: /decks/:deckId */
  /*Deck state should be at the deck level - home/layout page shows multiple decks*/
  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const { url } = useRouteMatch();


  /*Set the deck to the deck fetched from the API. Re-usable function for EditCard*/
  const readDeckFromAPI = () => {
    setDeck({});
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const deckFromApi = await readDeck(deckId, abortController.signal);
        setDeck(deckFromApi);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadDeck();
    return () => abortController.abort();
  }

    /*Set the deck to the deck fetched from the API */
  useEffect(() => {
   readDeckFromAPI()
  }, []);

  /*Try using useEffect for deleteCard. Doesn't work. Change deck state to activate useEffect? Whenever deck state changes, add the updated deck? // or, make API update and then */
  /* Now - update state to new deck without card. Then, make API call to delete card from deck*/
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

      /*still not sure about abortController here */
      const abortController = new AbortController();

      /*Remove card from the database via API call */
      async function removeCard() {
        try {
          await deleteCard(cardIdToDelete, abortController.signal);
        } catch (error) {
          if (error.name != "AbortError") {
            throw error;
          }
        }
      }
      removeCard();

      return () => abortController.abort();
    }
  };

  /*Create header for the deck view - shows details about the deck */
  const deckHeader = (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{deck.name}</h5>
        <p className="card-text">{deck.description}</p>
        <button className="btn btn-secondary">
          {
            <Link className="text-reset" to={`${url}/edit`}>
              Edit
            </Link>
          }
        </button>
        <button className="btn btn-primary">
          {
            <Link className="text-reset" to={`${url}/study`}>
              Study
            </Link>
          }
        </button>
        <button className="btn btn-primary">
          {
            <Link className="text-reset" to={`${url}/cards/new`}>
              Add Card
            </Link>
          }
        </button>
        <button
          className="btn btn-danger"
          onClick={() => deleteDeckHandler(deckId)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  /*If the API call has updated the deck to a deck from the API (therefore it has an id key) - display the deck */
  if (deck.id) {
    /*This section creates UIs all cards with the responses */
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
      <>
        {deckHeader}
        {deckTestCards}
      </>
    );
  }
  return "Loading";
}

export default Deck;
