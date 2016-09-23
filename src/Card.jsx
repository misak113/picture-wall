
import React from 'react';

export default class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deltaMoveX: 0,
			deltaMoveY: 0,
			editedPerson: {...props.person},
		};
	}

	render() {
		const editable = this.props.editable;
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
				<h2>
					{
						!editable
						? person.nick
						: (
							<input
								style={{ width: "100%" }}
								value={this.state.editedPerson.nick}
								placeholder="nick"
								onChange={(event) => this.setState({ editedPerson: {
									...this.state.editedPerson,
									nick: event.target.value,
								}})}
							/>
						)
					}
					<small>
						{
							!editable
							? person.firstName
							: (
								<input
									style={{ width: "100%" }}
									value={this.state.editedPerson.firstName}
									placeholder="first name"
									onChange={(event) => this.setState({ editedPerson: {
										...this.state.editedPerson,
										firstName: event.target.value,
									}})}
								/>
							)
						}
						{
							!editable
							? person.lastName
							: (
								<input
									style={{ width: "100%" }}
									value={this.state.editedPerson.lastName}
									placeholder="last name"
									onChange={(event) => this.setState({ editedPerson: {
										...this.state.editedPerson,
										lastName: event.target.value,
									}})}
								/>
							)
						}
					</small>
				</h2>
				{
					!editable
					? null
					: (
						<input
							style={{ width: "100%" }}
							value={this.state.editedPerson.departement}
							placeholder="departement"
							onChange={(event) => this.setState({ editedPerson: {
								...this.state.editedPerson,
								departement: event.target.value,
							}})}
						/>
					)
				}
				<img
					src={"./pictures/" + person.profilePicture}
					style={{
						width: "5vw",
						height: "5vw",
					}}
				/>
				{
					editable
					? <button onClick={() => this.save()}>Save</button>
					: null
				}
				{
					!editable
					? <button onClick={() => this.context.dispatch({ type: "EDIT_PERSON", personId: person.id })}>Edit</button>
					: null
				}
				{
					!editable
					? <button onClick={() => this.context.dispatch({ type: "DELETE_PERSON", personId: person.id })}>Delete</button>
					: null
				}
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

	save() {
		const editedPerson = this.state.editedPerson;
		this.context.dispatch({
			type: "SAVE_PERSON",
			person: editedPerson
		});
	}
}
Card.contextTypes = {
	dispatch: React.PropTypes.any
};
