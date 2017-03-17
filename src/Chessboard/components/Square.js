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
        let moves = this.props.selection ? this.props.selection.moves : []
        if (!(this.props.canDrop || (moves.find(e => { return  this.props.coordinate === e.to})))) {
            return null;
        }

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

        let s = {
            color   : isBlackSquare ? colors.primary.light : colors.primary.dark,
            fontSize: (this.props.size * .28 * .125) + 'px',
        };
        return (
            <div>
                {!!number ? <div className="chessboard-coordinate-ul" style={s}>{number}</div> : null }
                {!!letter ? <div className="chessboard-coordinate-br" style={s}>{letter}</div> : null }
            </div>
        )
    },

    handleSelection: function(coordinate) {
        if (!(this.props.selection)) {
            return
        }

        console.log(this.props);
        this.props.Move({
            method: 'user',
            from  : this.props.selection.source,
            to    : coordinate,
            type  : this.props.selection.type, 
            color : this.props.selection.color,
        })
    },

    render: function() {
        let index = this.props.index;
        let x = index % 8;
        let y = Math.floor(index / 8);
        let black = ( x + y ) % 2 === 1;

        let s = {background: black ? colors.primary.dark  : colors.primary.light};

        if (this.props.draggable || true) {

            return this.props.connectDropTarget(
                <div className="chessboard-square-layout" style={s}
                onClick={() => {this.handleSelection(this.props.coordinate)}}>
                    {this.props.children}
                    {this.renderOverlay(black ? 'dark' : 'light')}
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
        return item.moves.find(e => { return e.to === props.coordinate});
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
        coordinates : state.Chessboard.get("coordinates"),
        orientation : state.Chessboard.get("orientation"),
        promotion   : state.Chessboard.get('promotion'),
        size        : state.Chessboard.get('size'),
        selection   : state.Chessboard.get('selection'),
    }
}

export default connect(mapStateToProps, {Move})(
    DropTarget(itemTypes.PIECE, squareTarget, collect)(Square
));
