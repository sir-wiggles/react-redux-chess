export const SET_FEN                       = 'SET_FEN';
export const FLIP_ORIENTATION              = 'FLIP_ORIENTATION';
export const SHOW_COORDINATES              = 'SHOW_COORDINATES';
export const CHESSBOARD_PIECE_MOVE         = 'CHESSBOARD_PIECE_MOVE';
export const CHESSBOARD_SELECT_PROMOTION   = 'CHESSBOARD_SELECT_PROMOTION';

function MovePiece(directions) {
    return {type: CHESSBOARD_PIECE_MOVE, directions};
}

function SelectPromotion(directions) {
    return {type: CHESSBOARD_SELECT_PROMOTION, directions};    
}

export function Promote(directions, promotion) {
    return function(dispatch) {
        directions.promotion = promotion[1]; 
        dispatch(MovePiece(directions));
    }
}

export function Move(directions) {
    return function(dispatch){

        let piece = directions.piece.type[1];
        let color = directions.piece.type[0];
        let rank  = directions.to[1];

        if ((piece === 'p' && color === 'w' && rank === '8') ||
            (piece === 'p' && color === 'b' && rank === '1')) {
            dispatch(SelectPromotion(directions));
        } else {
            dispatch(MovePiece(directions));
        }
    }
}

export function Orientation(color) {
    return {type: FLIP_ORIENTATION, color}
}

export function Coordinates(state) {
    return {type: SHOW_COORDINATES, state}
}

export function SetFEN(fen) {
    return {type: SET_FEN, fen};
}