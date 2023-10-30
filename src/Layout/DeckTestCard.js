import React from "react";
import { Link, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";

function DeckTestCard({deleteCardHandler, cardId, front, back}){

const {url} = useRouteMatch();

const cardUI =  <div className="card" style={{"width": "18rem"}}>
          <div className="card-body">
            <p className="card-text">
              {front}
            </p>
            <p className="card-text">
              {back}
            </p>
            <button className="btn btn-secondary">
                {<Link className="text-reset" to={`${url}/cards/${cardId}/edit`}>Edit</Link>}
            </button>
            <button className="btn btn-danger" onClick={()=>deleteCardHandler(cardId)}>
                Delete
            </button>
          </div>
        </div>

return cardUI;


}

export default DeckTestCard;