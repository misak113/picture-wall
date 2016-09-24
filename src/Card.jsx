
import React from 'react';
import ReactDOM from 'react-dom';

export default class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deltaMoveX: 0,
			deltaMoveY: 0,
			editedPerson: {...props.person},
		};
	}

	componentDidMount() {
		window.document.addEventListener('mouseup', () => this.stopMoving());
		window.document.addEventListener('mousemove', (event) => this.move(event));
	}

	render() {
		const adminView = this.props.adminView;
		const editable = this.props.editable;
		const person = this.props.person;
		const editedPerson = this.state.editedPerson;
		const deltaMoveX = this.state.deltaMoveX;
		const deltaMoveY = this.state.deltaMoveY;
		const position = this.getPosition();
		return (
			<div
				style={{
					border: "1px solid black",
					textAlign: "center",
					position: "absolute",
					fontSize: "0.4em",
					left: (position.left + deltaMoveX) + "%",
					top: (position.top + deltaMoveY) + "%",
					transform: "rotate(" + position.rotation + "deg)",
					width: "8vw",
					height: "8vw",
				}}
				onMouseDown={(event) => this.startMoving(event)}
			>
				<h2>
					{
						adminView && editable
						? (
							<input
								style={{ width: "100%" }}
								value={editedPerson.nick}
								placeholder="nick"
								onChange={(event) => this.setState({ editedPerson: {
									...editedPerson,
									nick: event.target.value,
								}})}
							/>
						)
						: person.nick
					}
					<small>
						{
							adminView && editable
							? (
								<input
									style={{ width: "100%" }}
									value={editedPerson.firstName}
									placeholder="first name"
									onChange={(event) => this.setState({ editedPerson: {
										...editedPerson,
										firstName: event.target.value,
									}})}
								/>
							)
							: person.firstName
						}
						{
							adminView && editable
							? (
								<input
									style={{ width: "100%" }}
									value={editedPerson.lastName}
									placeholder="last name"
									onChange={(event) => this.setState({ editedPerson: {
										...editedPerson,
										lastName: event.target.value,
									}})}
								/>
							)
							: person.lastName
						}
					</small>
				</h2>
				{
					adminView && editable
					? (
						<input
							style={{ width: "100%" }}
							value={editedPerson.departement}
							placeholder="departement"
							onChange={(event) => this.setState({ editedPerson: {
								...editedPerson,
								departement: event.target.value,
							}})}
						/>
					)
					: null
				}
				<img
					src={"picture/" + (editedPerson.profilePicture || person.profilePicture)}
					style={{
						width: "6vw",
						height: "6vw",
					}}
				/>
				{
					adminView && editable
					? <input ref="picture-input" type="file" onChange={(event) => this.uploadProfilePicture(event)}/>
					: null
				}
				{
					adminView && editable
					? <button onClick={() => this.save()}>Save</button>
					: null
				}
				{
					adminView && !editable
					? <button onClick={() => this.context.dispatch({ type: "EDIT_PERSON", personId: person.id })}>Edit</button>
					: null
				}
				{
					adminView && !editable
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
			top: 0,
			rotation: 0
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
				rotation: Math.round(Math.random() * 40) - 20
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
			this.deselectAll();
		}
	}

	save() {
		const editedPerson = this.state.editedPerson;
		this.context.dispatch({
			type: "SAVE_PERSON",
			person: editedPerson
		});
	}

	uploadProfilePicture(event) {
		const pictureInput = ReactDOM.findDOMNode(this.refs['picture-input']);
		this.context.dispatch({
			type: "UPLOAD_IMAGE",
			file: pictureInput.files[0],
			done: (fileName) => this.setState({ editedPerson: {
				...this.state.editedPerson,
				profilePicture: fileName,
			}}),
		})
	}

	deselectAll() {
		window.getSelection().empty();
	}
}
Card.contextTypes = {
	dispatch: React.PropTypes.any
};
