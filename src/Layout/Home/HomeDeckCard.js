import React from "react";
import {Link, useRouteMatch} from "react-router-dom";

/* Leveraged by "Home" component. Returns a bootstrap card for each Deck containing name, description, view, study, delete buttons */
function HomeDeckCard({ deck, deleteDeckHandler}) {

  const {url} = useRouteMatch();

  const card = (
    <div className="card">
      <div className="card-body">
        <div className="card-header-wrapper">
          <h5 className="card-title">{deck.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{deck.cards.length} cards</h6>
        </div>
        <p className="card-text">
          {deck.description}
        </p>
        <div className="card-wrapper">
          <button className="btn btn-secondary card-btn">
              <Link className="text-reset" to={`${url}decks/${deck.id}`}>View</Link>
          </button>
          <button className="btn btn-primary card-btn">
              <Link className="text-reset" to={`${url}decks/${deck.id}/study`}>Study</Link>
          </button>
          <button className="btn btn-danger card-btn" onClick={deleteDeckHandler}>
              Delete
          </button>
        </div>
       
      </div>
    </div>
  );

  return card;
}

export default HomeDeckCard;
