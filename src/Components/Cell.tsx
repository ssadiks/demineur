import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
    index: number;
    adjacentCellsWithBombsCount?: number;
};

export const getEmojis = (
    status: CellStatus,
    adjacentCellsWithBombsCount?: number
) => {
    const emojis = {
        untouched: '',
        dug: '',
        flagged: '🚩',
        detonated: '💥'
    };
    if (status === 'dug' && adjacentCellsWithBombsCount !== 0) {
        return adjacentCellsWithBombsCount;
    }
    return emojis[status];
};

const getBackgroundColor = (status: CellStatus): string => {
    switch (status) {
        case 'untouched':
        case 'flagged':
            return '#aad750';
        case 'detonated':
            return '#000';
        default:
            return '#e5c29e';
    }
};

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor: getBackgroundColor(status)
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    const { status, adjacentCellsWithBombsCount, onclick } = props;
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                onclick(ev);
            }}
            style={cellStyle(status)}
        >
            {getEmojis(status, adjacentCellsWithBombsCount)}
        </div>
    );
};
