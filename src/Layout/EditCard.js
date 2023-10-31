import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readCard, updateCard, createCard, readDeck } from "../utils/api";

function EditCard({ deck, edit, toggleDeckUpdate }) {
  /*This path: /decks/:deckId/cards/:cardId/edit */
  /*This is a form that lets you edit a card within a deck */

  /*Gets deckID, cardID from URL. use cardId only if editing  */

  const {deckId, cardId} = useParams();
  
  /*Used for initialization and reset */
  const blankCard = {
    front: "",
    back: "",
  };

  /*set up card state*/
  const [card, setCard] = useState(blankCard);
  const history = useHistory();

  /*Read card from API (only if editing existing card) - needs this to pre-fill the card state & form*/
  const readCardFromAPI = () => {
    setCard({});
    const abortController = new AbortController();
    async function loadCard() {
      try {
        const cardFromApi = await readCard(cardId, abortController.signal);
        setCard(cardFromApi);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadCard();
    return () => abortController.abort();
  };

  /*Read Card from API and overwrite blank card - only if editing existing card*/
  useEffect(() => {
    if (edit) {
      readCardFromAPI();
    }
  }, []);

   /*read deck from decks */
   useEffect(()=> {
    readDeck(deck.id);
  }, [])

  /*Event handler when form is submitted. Post the card to the API (either update or create)  */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    async function refineCard() {
      try {
        await updateCard(card, abortController.signal);
        history.push(`/decks/${deckId}`);
        //setFormData({...initialFormData});
        /*Call for re-render in parent*/
        toggleDeckUpdate((currentValue) => !currentValue)
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    async function makeCard() {
      try {
        await createCard(deckId, card, abortController.signal);
        setCard({ ...blankCard });
         /*Call for re-render in parent*/
         toggleDeckUpdate((currentValue) => !currentValue)
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    /*If editing an existing card - updateCard. Otherwise: createCard */
    if (edit) {
      refineCard();
    } else {
      makeCard();
    }

    return () => abortController.abort();
  };

  /*Keep card form data up to date with state */
  const handleChange = (event) => {
    setCard({ ...card, [event.target.name]: event.target.value });
  };

  /* Create markup */

    const title = <h1>{deck.name}: {edit ? `Edit Card` : `Add Card`}</h1>;

    const form = (
      <form onSubmit={handleSubmit}>
        <label htmlFor="front">Front</label>
        <textarea
          type="text"
          name="front"
          id="front"
          placeholder="Front side of card"
          value={card.front}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="back">Back</label>
        <textarea
          type="text"
          name="back"
          id="back"
          placeholder="Back side of card"
          value={card.back}
          onChange={handleChange}
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
            {edit ? `Edit Card ${cardId}` : `Add Card`}
          </li>
        </ol>
      </nav>
    );

    return (
      <main>
        {breadcrumb}
        {title}
        {form}
      </main>
    );
  

}

export default EditCard;
