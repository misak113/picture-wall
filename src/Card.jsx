
import React from 'react';

export default class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deltaMoveX: 0,
			deltaMoveY: 0,
		};
	}

	render() {
		const person = this.props.person;
		const position = this.getPosition();
		return (
			<div
				style={{
					border: "1px solid black",
					textAlign: "center",
					position: "absolute",
					fontSize: "0.4em",
					left: (position.left + this.state.deltaMoveX) + "%",
					top: (position.top + this.state.deltaMoveY) + "%",
					width: "6.7vw",
					height: "6.7vw",
				}}
				onMouseDown={(event) => this.startMoving(event)}
				onMouseUp={() => this.stopMoving()}
				onMouseMove={(event) => this.move(event)}
				onMouseOut={() => this.stopMoving()}
			>
				<h2>{person.firstName} {person.lastName}</h2>
				<img
					src={"./pictures/" + person.profilePicture}
					style={{
						width: "5vw",
						height: "5vw",
					}}
				/>
			</div>
		);
	}

	getPosition() {
		return this.props.position || {
			personId: this.props.person.id,
			left: 0,
			top: 0
		};
	}

	startMoving(event) {
		this.setState({
			moving: true,
			startMoveX: event.pageX,
			startMoveY: event.pageY,
			lastMoveX: event.pageX,
			lastMoveY: event.pageY,
			deltaMoveX: 0,
			deltaMoveY: 0,
		});
	}

	stopMoving() {
		if (this.state.moving) {
			const position = this.getPosition();
			this.context.dispatch({ type: "SAVE_PERSON_POSITION", position: {
				personId: this.props.person.id,
				left: Math.round(position.left + this.state.deltaMoveX),
				top: Math.round(position.top + this.state.deltaMoveY),
			}});
			this.setState({
				moving: false,
				deltaMoveX: 0,
				deltaMoveY: 0,
				lastMoveX: 0,
				lastMoveY: 0,
			});
		}
	}

	move(event) {
		if (this.state.moving) {
			this.setState({
				moving: true,
				lastMoveX: event.pageX,
				lastMoveY: event.pageY,
				deltaMoveX: this.state.deltaMoveX + (event.pageX - this.state.lastMoveX) / document.body.clientWidth * 100,
				deltaMoveY: this.state.deltaMoveY + (event.pageY - this.state.lastMoveY) / document.body.clientHeight * 100,
			});
		}
	}
}
Card.contextTypes = {
	dispatch: React.PropTypes.any
};
