import "./Grid.css";
import type { Game } from "../game.ts";
import GameItem from "./Game.tsx"
import { useState, type ChangeEvent, type DragEvent } from "react";

interface GridProps {
  games: Array<Game>
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>
  setGames: React.Dispatch<React.SetStateAction<Game[]>>
  setSearchID: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Grid({ games, setOverlay, setGames, setSearchID }: GridProps) {
  const [dragging, setDragging] = useState<number | null>(null)

  const updateTitle = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const newArray = games.map((item, i) => {
      if (item.id === id) {
        return { ...item, ["title"]: e.target.value };
      } else {
        return item;
      }
    });
    setGames(newArray);
  }

  const coverClick = (id: number) => () => {
    setOverlay(true)
    setSearchID(id)
  }

  const dragStart = (e: React.DragEvent<HTMLElement>, item: Game) => {
    setDragging(item.id)
  }
  const dragEnd = () => {
    setDragging(null)
  }
  const dragDrop = (e: React.DragEvent<HTMLElement>, game: Game) => {
    const dragOrder = games.find(el => el.id === dragging)?.order
    const dropOrder = games.find(el => el.id === game.id)?.order

    if (typeof dragOrder === 'undefined' || typeof dropOrder === 'undefined') return

    const newArray = games.slice().map((item, index) => {
      if (item.id === dragging) {
        return { ...item, ["order"]: dropOrder }
      }
      if (item.id === game.id) {
        return { ...item, ["order"]: dragOrder }
      }
      return { ...item }
    })
    setGames(newArray)
  }

  const removeClick = (id: number) => {
    let newArray = games.slice()
    const index = newArray.findIndex(el => el.id === id)
    newArray = newArray.slice(0, index).concat(newArray.slice(index + 1))
    setGames(newArray)
  }

  const gridList = games.sort((a, b) => {
    return a.order - b.order;
  }).map((game, index) =>
    <GameItem key={game.id} game={game} coverClick={coverClick} updateTitle={updateTitle} removeClick={removeClick} onDragStart={e => dragStart(e, game)} onDrop={e => dragDrop(e, game)} onDragEnd={dragEnd}></GameItem>
  );

  return (<>
    <div className="Grid">
      {gridList}
    </div>
  </>);
}
