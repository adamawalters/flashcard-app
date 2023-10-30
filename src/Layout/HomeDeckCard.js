import React from "react";
import {Link, useRouteMatch} from "react-router-dom";

/*return a bootstrap card for each deck containing name, description, view, study, delete buttons */
function HomeDeckCard({ deck, deleteDeckHandler}) {
    /*Home path: "/" */
  /*for this deck, checks which cards out of all cards have the deck id the same as this decks id - then returns the length of that array */  

    const {url} = useRouteMatch();

  const card = (
    <div className="card" style={{"width": "18rem"}}>
      <div className="card-body">
        <h5 className="card-title">{deck.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{deck.cards.length} cards</h6>
        <p className="card-text">
          {deck.description}
        </p>
        <button className="btn btn-secondary">
            <Link className="text-reset" to={`${url}decks/${deck.id}`}>View</Link>
        </button>
        <button className="btn btn-primary">
            <Link className="text-reset" to={`${url}decks/${deck.id}/study`}>Study</Link>
        </button>
        <button className="btn btn-danger" onClick={deleteDeckHandler}>
            Delete
        </button>
       
      </div>
    </div>
  );

  return card;
}

export default HomeDeckCard;
