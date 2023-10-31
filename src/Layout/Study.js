import React, { useState, useEffect} from "react";
import {
  Link,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck } from "../utils/api";


function Study({deck}) {
  /*Path: /decks/:deckId/study */
  /*Summary: gets deck from URL & API call & lets students study each card in the deck. Front or back is managed via state. Then restarts the program or goes home.  */
  /*Index is used to move between the cards within the deck - state is updated by event handlers. Initially set to 0*/
  const [index, setIndex] = useState(0);

  /*This state determines whether the front or back of card is shown, and is togged by event handlers. Set to true initially so front is shown */
  const [frontView, setFrontView] = useState(true);

  /*History is used to navigate to home page post completion */
  const history = useHistory();

  /*read deck from decks */
  useEffect(()=> {
    readDeck(deck.id);
  }, [])

  /*Updates the card index when user clicks next. If at the end, displays a message and restarts the deck or goes home */
  const nextBtnHandler = () => {
    /*If we are at the last card, show popup to restart deck. */
    if (index === deck.cards.length - 1) {
      if (window.confirm("Restart cards?")) {
        /*Restart the deck - set Index to 0 */
        setIndex(0);
        setFrontView(true);
      } else {
        /*Go Home */
        history.push("/");
      }
    /*If we are not at the last card - increment the index (go to next card) */
    } else {
      setIndex(index + 1);
      setFrontView(true);
    }
  };

  /* Once deck has loaded, create view & return it. Create front, back, and not enough cards view and conditionally return the right one.*/
  

    /*Create title */
    const title = <h1>Study: {deck.name} </h1>;

    /*Create breadcrumb */
    const breadcrumb = (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Study
          </li>
        </ol>
      </nav>
    );
    /*create not enough cards view */
    const notEnoughCardsView = (
      <div>
        <h1>Not enough cards.</h1>
        <p>
          You need at least 3 cards to study. There are {deck.cards.length}{" "}
          cards in this deck.
        </p>
        <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
          + Add Cards
        </Link>
      </div>
    );

    /*If there aren't enough cards - return the breadcrumb, title, and not enough cards view. Don't try to query specific cards as there may be no cards */
    if (deck.cards.length < 3) {
      return (
        <div>
          {breadcrumb}
          {title}
          {notEnoughCardsView}
        </div>
      );
    }

    /*Otherwise create front & back card views and return them conditionally based on the frontView state */
    const frontCardView = (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Card {index + 1} of {deck.cards.length}
          </h5>
          <p className="card-text">{deck.cards[index].front}</p>
          <button
            onClick={() => setFrontView(!frontView)}
            className="btn btn-primary mr-1"
          >
            Flip
          </button>
        </div>
      </div>
    );

    const backCardView = (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Card {index + 1} of {deck.cards.length}
          </h5>
          <p className="card-text">{deck.cards[index].back}</p>
          <button
            onClick={() => setFrontView(!frontView)}
            className="btn btn-secondary mr-1"
          >
            Flip
          </button>
          <button onClick={nextBtnHandler} className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    );

    return (
      <main>
        {breadcrumb}
        {title}
        {frontView ? frontCardView : backCardView}
      </main>
    );
  }
  


export default Study;
