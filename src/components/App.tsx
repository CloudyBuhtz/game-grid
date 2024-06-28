import { useEffect, useState } from "react";

import Grid from "./Grid";
import Overlay from "./Overlay"

import type { Game } from "../game"

import "./App.css"

export default function App() {
  const [overlay, setOverlay] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [searchID, setSearchID] = useState<number | null>(null)
  const [share, setShare] = useState<string>("")

  useEffect(() => {
    if (location.hash.length > 0) {
      const data = JSON.parse(atob(location.hash.slice(1)))
      setGames(data)
      location.hash = ""
      return
    }

    const saved = localStorage.getItem("games");
    if (!saved) return

    const json: Game[] = JSON.parse(saved);
    setGames(json)
  }, [])

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games))
    setShare(`${location.origin}#${btoa(JSON.stringify(games))}`)
  }, [games])

  const addNewGame = () => {
    const newID = games.reduce((acc: number, item) => {
      return (item.id > acc) ? item.id : acc;
    }, 0) + 1

    const newOrder = games.reduce((acc: number, item) => {
      return (item.order > acc) ? item.order : acc;
    }, 0) + 1

    const newGame: Game = {
      id: newID,
      title: "",
      order: newOrder,
      image: "https://placehold.co/264x352?text=Click+to+Edit",
    }
    const newArray = [...games, newGame]
    setGames(newArray)
  }

  return (
    <>
      <div className="controls">
        <div className="add" onClick={addNewGame}><i className="ri-add-fill"></i></div>
        <div className="clear" onClick={() => { setGames([]) }}><i className="ri-delete-bin-fill"></i></div>
      </div>
      <div className="share">
        <input type="text" value={share} readOnly />
      </div>
      <div className="container">
        <Grid games={games} setOverlay={setOverlay} setGames={setGames} setSearchID={setSearchID}></Grid>
      </div>
      <Overlay show={overlay} games={games} setGames={setGames} setOverlay={setOverlay} searchID={searchID} setSearchID={setSearchID}></Overlay>
    </>
  );
}
