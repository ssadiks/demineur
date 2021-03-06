import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    test('a new game is neither lost or won', () => {
        const grid = Grid.generate(1, 1, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a bomb has been dug', () => {
        const cellWithBomb = Cell.withBomb();
        const grid = new Grid(1, [cellWithBomb], 1);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDetonated = grid.sendActionToCell(0, {
            name: 'dig',
            adjacentCellsWithBombsCount: 0
        });

        expect(isDefeated(gridDetonated)).toBe(true);
        expect(isVictorious(gridDetonated)).toBe(false);
    });

    test('a game is won if every cell without bomb has been dug and number of flag is less than bombs', () => {
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [cellWithoutBomb], 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridFlagged = grid.sendActionToCell(0, {
            name: 'flag',
            adjacentCellsWithBombsCount: undefined
        });

        expect(isDefeated(gridFlagged)).toBe(false);
        expect(isVictorious(gridFlagged)).toBe(false);

        const gridDug = grid.sendActionToCell(0, {
            name: 'dig',
            adjacentCellsWithBombsCount: 0
        });

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });
});
