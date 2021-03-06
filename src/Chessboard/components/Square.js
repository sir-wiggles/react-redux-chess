import React          from 'react';
import { DropTarget } from 'react-dnd';
import { connect }    from 'react-redux';
import { Move }       from '../actions.js';
import { 
    colors,
    itemTypes,
    squaresWithCoordinates,
} from '../constants.js';


const Square = React.createClass({
    renderOverlay: function(shade) {
        let s = {background: colors.highlight[shade]};
        return <div className={"chessboard-target-overlay"} style={s}></div>;
    },

    renderCoordinate: function(isBlackSquare) {
        if (!this.props.coordinates) {
            return null;
        }

        let letter = this.props.coordinate[0];
        let number = this.props.coordinate[1];
        let corner = squaresWithCoordinates[
            this.props.orientation ? 'white' : 'black'
        ][this.props.coordinate];

        if (corner === 'n') {
            letter = '';
        } else if (corner === 'l') {
            number = '';
        }  else if (corner === undefined) {
            return 
        }

        let s = {color: isBlackSquare ? colors.primary.light : colors.primary.dark};
        return (
            <div>
                {!!number ? <div className="chessboard-coordinate-ul" style={s}>{number}</div> : null }
                {!!letter ? <div className="chessboard-coordinate-br" style={s}>{letter}</div> : null }
            </div>
        )
    },

    render: function() {
        let index = this.props.index;
        let x = index % 8;
        let y = Math.floor(index / 8);
        let black = ( x + y ) % 2 === 1;

        let s = {background: black ? colors.primary.dark  : colors.primary.light};

        if (this.props.draggable || true) {

            return this.props.connectDropTarget(
                <div className="chessboard-square-layout" style={s}>
                    {this.props.children}
                    {this.props.canDrop && this.renderOverlay(black ? 'dark' : 'light')}
                    {this.props.coordinates ? this.renderCoordinate(black) : null}
                </div>
            );
        } else {
            return (
                <div className="chessboard-square-layout" style={s}>
                    {this.props.children}
                </div>
            );
        }
    }
})

const squareTarget = {
    canDrop(props, monitor) {
        let item = monitor.getItem();
        return item.moves.includes(props.coordinate);
    },

    drop(props, monitor) {
        let piece = monitor.getItem();
        let move = {
            from  : piece.coordinate,
            to    : props.coordinate,
            type  : piece.type[1],
            color : piece.type[0],
            method: 'user',
        }
        props.Move(move);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

function mapStateToProps(state) {
    return {
        coordinates: state.Chessboard.get("coordinates"),
        orientation: state.Chessboard.get("orientation"),
        promotion  : state.Chessboard.get('promotion'),
    }
}

export default connect(mapStateToProps, {Move})(
    DropTarget(itemTypes.PIECE, squareTarget, collect)(Square
));
