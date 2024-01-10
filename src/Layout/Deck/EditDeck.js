import React, { useReducer, useState } from "react";
import {
  useParams,
  Link,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { updateDeck } from "../../utils/api";


function reducer(state, action) {
  switch(action.type) {
    case "name":
      return {...state, name: action.payload}
    case "description":
      return {...state, description: action.payload}
    default:
      throw new Error("switch statement editDeck reducer")
  }

}


function EditDeck({deck, setDeck, toggleDeckUpdate}) {
  /*Path: /decks/:deckId/edit */

  /*Prefill form state to existing deck */
  const { deckId } = useParams();
  const history = useHistory();

  /* useReducer - state is set to deck */
  /* dispatch sends an object to the reducer telling it what part of state to update */
  const [state, dispatch] = useReducer(reducer, {...deck})
  
  /*Event handler runs when updated deck data is submitted. Posts to server and goes to deck page. Deck state updated to form.  */
  const handleSubmit = async (event) => {
    event.preventDefault();
        try{
            const response = await updateDeck(state);
            setDeck({...state});
            const id = response.id;
             /*Call for re-render of deck in parent*/
            toggleDeckUpdate((currentValue) => !currentValue)
            history.push(`/decks/${id}`)
        } catch(error) {
            if(error.name !== "AbortError") {
                throw Error;
            }
        }
  }
  

  const breadcrumb = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item" aria-current="page">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item" aria-current="page">
          <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Edit Deck
        </li>
      </ol>
    </nav>
  );

  const title = <h1>Edit Deck</h1>;

  const form = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Deck Name"
        value={state.name}
        onChange={(e) => dispatch({type: "name", payload: e.target.value})}
        required
      ></input>
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Brief description of deck"
        value={state.description}
        onChange={(e) => dispatch({type: "description", payload: e.target.value})}
        required
      ></textarea>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => {
          history.push(`/decks/${deckId}`)}
        }
      >
        Cancel
      </button>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );

  return (
    <main>
      {breadcrumb}
      {title}
      {form}
    </main>
  );
}

export default EditDeck;
