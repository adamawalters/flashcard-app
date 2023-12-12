import React from "react";
import {Link, useRouteMatch} from "react-router-dom";
import HomeDeckCard from "./HomeDeckCard"


function Home({decks, deleteDeckHandler}){
    /*Home path: "/" */
    /*Home accepts decks as a prop from index */
    /*For each deck in decks, Home will need to render it below the Create Deck Button with "View, Study, Delete"*/

    const {path} = useRouteMatch();

    /*creating create deck button. Links to create deck screen */
    const createDeckBtn = <button className="btn btn-secondary"><Link className="text-reset" to={`${path}decks/new`}>+ Create Deck</Link></button>;

    /* creates card views for each deck in the decks state and puts them into an array*/
    const deckList = decks.map((deck, index) => {
        return <HomeDeckCard key={index} deck={deck} deleteDeckHandler={()=>deleteDeckHandler(deck.id)}/>
    })

    return (
        <main>
            {createDeckBtn}
            {deckList}
        </main>
    )
}

export default Home;