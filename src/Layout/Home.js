import React from "react";
import {Link, useRouteMatch} from "react-router-dom";
import HomeDeckCard from "./HomeDeckCard"


function Home({decks, deleteDeckHandler}){
    /*Home path: "/" */
    /*Home accepts decks parameter */
    /*For each deck in decks, Home will need to render it below the Create Deck Button with "View, Study, Delete"*/

    const {path} = useRouteMatch();

    const createDeckBtn = <button className="btn btn-secondary"><Link className="text-reset" to={`${path}decks/new`}>+ Create Deck</Link></button>;
    //const deckArray = null; /*Need an array of cards here */
    const deckArray = decks.map((deck, index) => {
        return <HomeDeckCard key={index} deck={deck} deleteDeckHandler={()=>deleteDeckHandler(deck.id)}/>
    })

    return (
        <>
            {createDeckBtn}
            {deckArray}
            <p>Home</p>
        </>
    )
}

export default Home;