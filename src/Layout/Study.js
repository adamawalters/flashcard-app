import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { readDeck } from "../utils/api";

function Study() {
  /*Path: /decks/:deckId/study */

  const [deck, setDeck] = useState({});
  const [index, setIndex] = useState(0);
  const [frontView, setFrontView] = useState(true);
  const { deckId } = useParams();

  /*Load deck from API - then set cards state to the deck's cards property */
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
  };

  useEffect(() => {
    readDeckFromAPI();
  }, []);

  /*Updates the card index when user clicks next. If at the end, displays a message and restarts the deck or goes home */
  const nextBtnHandler = () => {
    if (index === deck.cards.length - 1) {
      if (window.confirm("Restart cards?")) {
        /*Restart the deck */
        setFrontView(true);
      } else {
        /*Go Home */
      }
    } else {
      setIndex(index + 1);
      setFrontView(true);
    }
  };

  /* Once deck has loaded, create view & return it*/
  if (deck.id) {
    const title = <h1>{deck.name}: Study </h1>;

    const frontCardView = (
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">
            Card {index + 1} of {deck.cards.length}
          </h5>
          <p className="card-text">{deck.cards[index].front}</p>
          <button
            onClick={() => setFrontView(!frontView)}
            className="btn btn-primary"
          >
            Flip
          </button>
        </div>
      </div>
    );

    const backCardView = (
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">
            Card {index + 1} of {deck.cards.length}
          </h5>
          <p className="card-text">{deck.cards[index].back}</p>
          <button
            onClick={() => setFrontView(!frontView)}
            className="btn btn-secondary"
          >
            Flip
          </button>
          <button onClick={nextBtnHandler} className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    );

    const notEnoughCardsView = (
      <div>
        <h1>Not enough cards.</h1>
        <p>
          You need at least 3 cards to study. There are {deck.cards.length} cards in this deck.
        </p>
        <Link to={`decks/${deckId}/cards/new`} className="btn btn-primary">+ Add Cards</Link>
      </div>
    );

    /*Logic to return either front, back, or "Not enough cards" */
    let viewToReturn;

    if (deck.cards.length < 3) {
      viewToReturn = notEnoughCardsView;
    } else if (frontView) {
      viewToReturn = frontCardView;
    } else {
      viewToReturn = backCardView;
    }

    return (
      <div>
        {title}
        {viewToReturn}
      </div>
    );
  }
  return "Loading";
}

export default Study;
