import { useState, useEffect } from "react";
import "./Overlay.css"
import type { Game } from "../game.ts";

interface OverlayProps {
  show: boolean
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>
  games: Game[]
  setGames: React.Dispatch<React.SetStateAction<Game[]>>
  searchID: number | null
  setSearchID: React.Dispatch<React.SetStateAction<number | null>>
}

interface Result {
  id: string,
  cover: {
    id: string,
    image_id: string
  }
  name: string
};

export default function Overlay({ show, setOverlay, games, setGames, searchID, setSearchID }: OverlayProps) {
  if (!show) return

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearch()
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, 500])

  const updateSearch = async () => {
    if (search === "") return

    console.log(search)
    let response = await fetch(`search/${search}.json`)
    let json: Result[] = []

    try {
      json = await response.json()
    } catch {
      console.log(response)
    }

    setResults(json)
  }

  const resultClick = (image_id: string) => {
    const size = "cover_big";
    const newArray = games.map((item: Game, i: number) => {
      if (item.id === searchID) {
        return { ...item, ["image"]: `https://images.igdb.com/igdb/image/upload/t_${size}/${image_id}.jpg` };
      } else {
        return item;
      }
    });
    setGames(newArray);
    setOverlay(false);
    setSearchID(null);
  }

  const resultList = results.map((result, index) =>
    <div className="result" key={result.id} onClick={() => { resultClick(result.cover.image_id) }}>{result.name}</div>
  )

  return (
    <>
      <div className="overlay" onClick={() => { setOverlay(false); setSearchID(null) }}>
        <div className="modal" onClick={e => { e.stopPropagation() }}>
          <input
            className="search"
            type="text"
            name="search"
            id="search"
            placeholder="Game Name"
            value={search}
            onChange={e => { setSearch(e.target.value) }}
            autoFocus
          />
          {resultList}
        </div>
      </div>
    </>
  )
}

