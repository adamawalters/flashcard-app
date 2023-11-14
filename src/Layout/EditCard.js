import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readCard, updateCard } from "../utils/api";
import CardForm from "./CardForm";

function EditCard({ deck, toggleDeckUpdate }) {
  /*This path: /decks/:deckId/cards/:cardId/edit */
  /*This is a form that lets you edit a card within a deck */

  /*Gets deckID, cardID from URL */
  const { deckId, cardId } = useParams();

  /*Used for initialization and reset */

  /*set up card state*/
  const [card, setCard] = useState({});
  const history = useHistory();

  /*Read Card from API and overwrite blank card when cardId updates*/
  useEffect(() => {
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

    readCardFromAPI();
  }, [cardId]);


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
        toggleDeckUpdate((currentValue) => !currentValue);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    refineCard();

    return () => abortController.abort();
  };

  /*Keep card form data up to date with state */
  const handleChange = (event) => {
    setCard({ ...card, [event.target.name]: event.target.value });
  };

  /* Create markup - uses reusable "CardForm" component */

  if (card.id) {
    const title = <h1>Edit Card</h1>;

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
            {`Edit Card ${cardId}`}
          </li>
        </ol>
      </nav>
    );

    return (
      <main>
        {breadcrumb}
        {title}
        <CardForm
          changeHandler={handleChange}
          submitHandler={handleSubmit}
          card={card}
          edit={true}
        />
      </main>
    );
  }

  return "Loading";
}

export default EditCard;
