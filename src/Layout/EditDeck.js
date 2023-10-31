import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { updateDeck, readDeck } from "../utils/api";

function EditDeck({deck, setDeck, toggleDeckUpdate}) {
  /*path: /decks/:deckId/edit */

  /*Prefill form state to deck */
  const [formData, setFormData] = useState({...deck});
  const { deckId } = useParams();
  const history = useHistory();

  /*Keep form state and input updated*/
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  
  /*Event handler runs when updated deck data is submitted. Posts to server and goes to deck page. Deck state updated to form.  */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    
    async function makeDeck() {
        try{
            const response = await updateDeck(formData, abortController.signal);
            setDeck({...formData});
            //setFormData({initialFormData})
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
    makeDeck();
    return () => abortController.abort();
  }
  
   /*read deck from decks */
   useEffect(()=> {
    readDeck(deck.id);
  }, [])


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
        value={formData.name}
        onChange={handleChange}
        required
      ></input>
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Brief description of deck"
        value={formData.description}
        onChange={handleChange}
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
