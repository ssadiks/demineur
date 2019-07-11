import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
    index: number;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥'
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
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status)}
        >
            {emojis[props.status]}
        </div>
    );
};
