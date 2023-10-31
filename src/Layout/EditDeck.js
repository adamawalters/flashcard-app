import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouteMatch,
  Link,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck, updateDeck } from "../utils/api";

function EditDeck() {
  /*path: /decks/:deckId/edit */
  /*Perhaps get loadDecks from Home page so that home page is always updated */

  const { deckId } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  /*Used to capture the deck name from the API - not linked to the form values, so not updated when form is typed in */
  const [originalDeckName, setOriginalDeckName] = useState("");

  /*Read from existing deck once */
  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const deckFromApi = await readDeck(deckId, abortController.signal);
        setFormData(deckFromApi);
        setOriginalDeckName(deckFromApi.name)
        
      } catch (error) {
        if (error.name != "AbortError") {
          throw error;
        }
      }
    }
    loadDeck();
  }, []);


  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  
  /*Event handler runs when updated deck data is submitted. Posts to server and goes to deck page */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController()
    
    async function makeDeck() {
        try{
            const response = await updateDeck(formData, abortController.signal);
            //setFormData({initialFormData})
            const id = response.id;
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
  
  /*Markup created without if statement b/c if API calls are not complete, they will display initial form data empty strings */
  const breadcrumb = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item" aria-current="page">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item" aria-current="page">
          <Link to={`/decks/${deckId}`}>{originalDeckName}</Link>
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
        onClick={() => history.push(`/decks/${deckId}`)}
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
