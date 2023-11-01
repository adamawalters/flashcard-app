import React from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CardForm({changeHandler, submitHandler, card, edit}){

    /*edit prop is needed to determine what text on buttons to show for submit */
    const {deckId} = useParams();

    /* Needed to navigate back home*/
    const history = useHistory();

    const form = (
    <form onSubmit={submitHandler}>
      <label htmlFor="front">Front</label>
      <textarea
        type="text"
        name="front"
        id="front"
        placeholder="Front side of card"
        value={card.front}
        onChange={changeHandler}
      ></textarea>
      <label htmlFor="back">Back</label>
      <textarea
        type="text"
        name="back"
        id="back"
        placeholder="Back side of card"
        value={card.back}
        onChange={changeHandler}
      ></textarea>
      <button
        className="btn btn-secondary"
        onClick={() => history.push(`/decks/${deckId}`)}
        type="button"
      >
        {edit ? "Cancel" : "Done"}
      </button>
      <button className="btn btn-primary" type="submit">
        {edit ? "Submit" : "Save"}
      </button>
    </form>
  );

    return form;
}

export default CardForm;