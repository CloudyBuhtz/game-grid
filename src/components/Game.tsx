import { useState } from "react"
import type { Game } from "../game"

import type { DragEvent, MouseEventHandler, ChangeEventHandler } from "react"

interface GameProps {
    game: Game
    coverClick: (id: number) => MouseEventHandler<HTMLElement>
    updateTitle: (id: number) => ChangeEventHandler<HTMLInputElement>
    removeClick: (id: number) => void
    onDragStart: (e: DragEvent<HTMLElement>) => void
    onDrop: (e: DragEvent<HTMLElement>) => void
    onDragEnd: () => void
}

export default function Game({ game, coverClick, updateTitle, removeClick, onDragStart, onDrop, onDragEnd }: GameProps) {
    const [dragOver, setDragOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    const thisDragStart = (e: DragEvent<HTMLElement>) => {
        setDragging(true)
        onDragStart(e)
    }
    const thisDragEnd = () => {
        setDragging(false)
        onDragEnd()
    }

    const thisDrop = (e: DragEvent<HTMLElement>) => {
        setDragOver(false)
        onDrop(e)
    }

    const thisDragEnter = (e: DragEvent<HTMLElement>) => {
        setDragOver(true);
    }
    const thisDragLeave = (e: DragEvent<HTMLElement>) => {
        if (e.target === e.currentTarget) {
            setDragOver(false);
        }
    }

    return (
        <div className={"game " + (dragOver && !dragging ? "dragover " : "") + (dragging ? "dragging" : "")} key={game.id} draggable onDragStart={thisDragStart} onDrop={thisDrop} onDragEnd={thisDragEnd} onDragOver={e => e.preventDefault()} onDragEnter={thisDragEnter} onDragLeave={thisDragLeave}>
            <img
                className="cover"
                alt=""
                draggable="false"
                src={game.image}
                onClick={coverClick(game.id)}
                onDragOver={e => e.preventDefault()}
            />
            <input
                className="title"
                type="text"
                name="title"
                placeholder="Click to Edit"
                maxLength={25}
                value={game.title}
                onChange={updateTitle(game.id)}
                onDragOver={e => e.preventDefault()}
            />
            <div className="remove" onClick={() => { removeClick(game.id) }} onDragOver={e => e.preventDefault()}>X</div>
        </div>
    )
}
