import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { Cells } from '../Domain/Grid';
import { isDefeated, isVictorious } from '../Domain/Rules';

export const getCoordinatesByIndex = (
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

export const getIndexByCoordinates = (
    x: number,
    y: number,
    columnsCount: number
) => {
    return columnsCount * y + x;
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
        const { x, y } = getCoordinatesByIndex(index, columnsCount);
        const adjacentCells = getAdjacentCells(x, y);
        const adjacentCellsWithBombsCount = adjacentCells.filter(
            cell => cell.infos._bomb == true
        ).length;
        console.log('adjacentCellsWithBombsCount', adjacentCellsWithBombsCount);
        if (adjacentCellsWithBombsCount === 0) {
            console.log('zero', adjacentCells);
            adjacentCells.map(cell => {
                const { x, y } = cell.coordo;
                const indexAdjacentCell = getIndexByCoordinates(
                    x,
                    y,
                    columnsCount
                );
                const cellule = grid.cellByIndex(indexAdjacentCell);
                console.log('indexx', indexAdjacentCell);
                console.log('ADJ', getAdjacentCells(x, y));
                /*updateGridCellStatus(indexAdjacentCell, {
                        name: 'dig',
                        adjacentCellsWithBombsCount: getAdjacentCellsWithBombsCount(
                            indexAdjacentCell,
                            columnsCount
                        )
                    });*/
                // handleClick(indexAdjacentCell, 0);
            });
        }
        return adjacentCells.filter(cell => cell.infos._bomb == true).length;
    };

    const getAdjacentCells = (x: number, y: number) => {
        let adj = [];
        if (x > 0) {
            const cell = grid.cellByCoodinates(x - 1, y);
            console.log('cell dug', cell);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x - 1, y } });
        }
        if (x < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x + 1, y);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x + 1, y } });
        }
        if (y > 0) {
            const cell = grid.cellByCoodinates(x, y - 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x, y: y - 1 } });
        }
        if (y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x, y + 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x, y: y + 1 } });
        }
        if (x > 0 && y > 0) {
            const cell = grid.cellByCoodinates(x - 1, y - 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x - 1, y: y - 1 } });
        }
        if (x > 0 && y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x - 1, y + 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x - 1, y: y + 1 } });
        }
        if (x < columnsCount - 1 && y < columnsCount - 1) {
            const cell = grid.cellByCoodinates(x + 1, y + 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x + 1, y: y + 1 } });
        }
        if (x < columnsCount - 1 && y > 0) {
            const cell = grid.cellByCoodinates(x + 1, y - 1);
            cell &&
                !cell._dug &&
                adj.push({ infos: cell, coordo: { x: x + 1, y: y - 1 } });
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
