import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';
import { getCoordinatesByIndex } from '../src/Components/Grid';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [], 0)).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(
                5,
                [expected, unexpected, unexpected, unexpected, unexpected],
                1
            );

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(
                4,
                [
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    expected
                ],
                1
            );

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toBe(expected);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });

        test('it get number of adjacent cells with bombs', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig(2);
                    expect(dugCell.adjacentCellsWithBombsCount).toBe(2);
                }
            });
        });
    });
    describe('getCoordonates()', () => {
        test('it get coordonates by index', () => {
            expect(getCoordinatesByIndex(0, 3)).toEqual({ x: 0, y: 0 });
        });
        test('it get coordonates by index', () => {
            expect(() => {
                getCoordinatesByIndex(9, 3);
            }).toThrowError('This cell is not in the grid');
        });
    });
});
