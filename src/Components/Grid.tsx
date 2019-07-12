import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { Cells } from '../Domain/Grid';
import { isDefeated, isVictorious } from '../Domain/Rules';

export const getCoordinates = (
    index: number,
    columnsCount: number
): { x: number; y: number } => {
    if (index < 0 || index > Math.pow(columnsCount, 2) - 1) {
        throw new Error('This cell is not in the grid');
    }
    const y = Math.floor(index / columnsCount);
    const x = index % columnsCount;
    return { x, y };
};

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus } = React.useContext(GameContext);
    const columnsCount = grid._column;

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(
            index,
            button === 0
                ? {
                      name: 'dig',
                      adjacentCellsWithBombsCount: getAdjacentCellsWithBombsCount(
                          index,
                          columnsCount
                      )
                  }
                : { name: 'flag', adjacentCellsWithBombsCount: undefined }
        );
    };

    const getAdjacentCellsWithBombsCount = (
        index: number,
        columnsCount: number
    ): number => {
        const { x, y } = getCoordinates(index, columnsCount);
        const adjacentCells = getAdjacentCells(x, y);
        return adjacentCells.filter(cell => cell._bomb == true).length;
    };

    const getAdjacentCells = (x: number, y: number) => {
        let adj: Cells = [];
        if (x > 0) {
            const cell = grid.cellByCoodinates(x - 1, y);
            cell && adj.push(cell);
        }
        if (x < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x + 1, y);
            cell && adj.push(cell);
        }
        if (y > 0) {
            const cell = grid.cellByCoodinates(x, y - 1);
            cell && adj.push(cell);
        }
        if (y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x, y + 1);
            cell && adj.push(cell);
        }
        if (x > 0 && y > 0) {
            const cell = grid.cellByCoodinates(x - 1, y - 1);
            cell && adj.push(cell);
        }
        if (x > 0 && y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x - 1, y + 1);
            cell && adj.push(cell);
        }
        if (x < columnsCount - 1 && y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x + 1, y + 1);
            cell && adj.push(cell);
        }
        if (x < columnsCount - 1 && y > 0) {
            const cell = grid.cellByCoodinates(x + 1, y - 1);
            cell && adj.push(cell);
        }
        return adj;
    };

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    return (
        <React.Fragment>
            <Game gameOver={gameOver} />
            <div
                style={{
                    display: 'flex',
                    border: '1px solid black',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        index={index}
                        status={cell.status}
                        adjacentCellsWithBombsCount={
                            cell.adjacentCellsWithBombsCount
                        }
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
        </React.Fragment>
    );
};
