import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Study({ deck }) {
  /*Path: /decks/:deckId/study */
  /*Objective: gets deck from URL & API call & lets students study each card in the deck. Front or back is managed via state. Then restarts the program or goes home.  */

  /*Index state is used to move between the cards within the deck, and is updated by the nextBtn handler. Initially set to 0*/
  const [index, setIndex] = useState(0);

  const [frontView, setFrontView] = useState(true);
  const history = useHistory();


  const nextBtnHandler = () => {
    /*If we are at the last card, show popup to restart deck. */
    if (index === deck.cards.length - 1) {
      if (
        window.confirm(
          "Restart cards? Click 'cancel' to return to the homepage"
        )
      ) {
        setIndex(0);
        setFrontView(true);
      } else {
        history.push("/");
      }
      /*If we are not at the last card - increment the index (go to next card) */
    } else {
      setIndex(index + 1);
      setFrontView(true);
    }
  };

  /*Create title */
  const title = <h1>{deck.name}: Study </h1>;

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
  /* Create "not enough cards" view */
  const notEnoughCardsView = (
    <div>
      <h1>Not enough cards.</h1>
      <p>
        You need at least 3 cards to study. There are {deck.cards.length} cards
        in this deck.
      </p>
      <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
        + Add Cards
      </Link>
    </div>
  );

  /*If there aren't enough cards - return the breadcrumb, title, and not enough cards view.*/
  if (deck.cards.length < 3) {
    return (
      <div>
        {breadcrumb}
        {title}
        {notEnoughCardsView}
      </div>
    );
  }

  /* Create front & back card views and return them conditionally based on the frontView state */
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
