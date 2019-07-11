import { Grid } from './Grid';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }
    return false;
};

export const isVictorious = (grid: Grid) => {
    let numberOfFlags = 0;

    for (let cell of grid) {
        if (cell.dug === false && cell.flagged === true) {
            numberOfFlags++;
        }

        if (
            (cell.dug === false && cell.flagged === false) ||
            cell.detonated === true ||
            numberOfFlags > grid.minesCount
        ) {
            return false;
        }
    }
    return true;
};
