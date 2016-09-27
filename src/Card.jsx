
import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './CardStyle';

export default class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deltaMoveX: 0,
			deltaMoveY: 0,
			editedPerson: {...props.person},
			revealed: props.editable,
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
		const zIndex = this.props.zIndex;
		const firstName = adminView && editable
			? (
				<input
					style={styles.editableInput}
					value={editedPerson.firstName}
					placeholder="first name"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						firstName: event.target.value,
					}})}
				/>
			)
			: person.firstName;
		const lastName = adminView && editable
			? (
				<input
					style={styles.editableInput}
					value={editedPerson.lastName}
					placeholder="last name"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						lastName: event.target.value,
					}})}
				/>
			)
			: person.lastName;
		const email = adminView && editable
			? (
				<input
					style={styles.editableInput}
					value={editedPerson.email}
					placeholder="email"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						email: event.target.value,
					}})}
				/>
			)
			: person.email;
		const nick = adminView && editable
			? (
				<input
					style={styles.editableInput}
					value={editedPerson.nick}
					placeholder="nick"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						nick: event.target.value,
					}})}
				/>
			)
			: person.nick;
		const departement = adminView && editable
			? (
				<input
					style={styles.editableInput}
					value={editedPerson.departement}
					placeholder="departement"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						departement: event.target.value,
					}})}
				/>
			)
			: <div className="chip right">{person.departement}</div>;
		const description = adminView && editable
			? (
				<textarea
					className="materialize-textarea"
					style={styles.editableInput}
					value={editedPerson.description}
					placeholder="description"
					onChange={(event) => this.setState({ editedPerson: {
						...editedPerson,
						description: event.target.value,
					}})}
				/>
			)
			: person.description;
		return (
			<div
				className="card"
				onMouseOver={() => this.setState({ hover: true })}
				onMouseOut={() => this.setState({ hover: false })}
				style={{
					...styles.card,
					left: (position.left + deltaMoveX) + "vw",
					top: (position.top + deltaMoveY) + "vw",
					zIndex: this.state.revealed || this.state.moving || this.state.hover ? 500 : zIndex,
					transform:
						"rotate(" + (this.state.revealed ? Math.round(Math.random() * 20) - 10 : position.rotation) + "deg) "
						+ "scale(" + this.getScale() + ")",
				}}
			>
				<div className="card-image waves-effect waves-block waves-light">
					<img
						onClick={() => this.toggleReveal()}
						className="activator"
						src={"picture/" + (editedPerson.profilePicture || person.profilePicture)}
						style={styles.profilePicture}
					/>
					<div style={styles.titleDepartement}>
						{departement}
					</div>
				</div>
				<div className="card-content">
					<span
						className="card-title activator grey-text text-darken-4 center"
						onClick={() => this.toggleReveal()}
					>
						{firstName} {lastName}
					</span>
					<p>
						{nick}
					</p>
				</div>
				<div
					className="card-reveal"
					style={{
						...styles.cardReveal,
						zIndex: this.state.revealed ? null : -1,
						opacity: this.state.revealed ? 1 : 0,
					}}
				>
					<span
						className="card-title grey-text text-darken-4 center"
						onClick={() => this.toggleReveal()}
					>
						{firstName} {lastName}
						{editable ? null : <i className="material-icons right">close</i>}
					</span>
					<p>
						{email}
					</p>
					<p>
						{nick}
					</p>
					{departement}
					<p>
						{description}
					</p>
					{
						adminView && editable
						? <input ref="picture-input" type="file" onChange={(event) => this.uploadProfilePicture(event)}/>
						: null
					}
					{adminView && editable ? <hr/> : null}
					{
						adminView && editable
						? <button className="btn" onClick={() => this.save()}>Save</button>
						: null
					}
					{
						adminView && editable
						? <button className="btn orange darken-1" onClick={() => this.context.dispatch({ type: "CANCEL_EDIT_PERSON", personId: person.id })}>Cancel</button>
						: null
					}
					{
						adminView && !editable
						? <button className="btn btn-small" onClick={() => this.context.dispatch({ type: "EDIT_PERSON", personId: person.id })}>Edit</button>
						: null
					}
					{
						adminView && !editable
						? <button className="btn btn-small red darken-1" onClick={() => this.delete()}>Delete</button>
						: null
					}
				</div>
				{
					adminView && !this.state.revealed
					? (
						<i
							onMouseDown={(event) => this.startMoving(event)}
							className="material-icons medium grey-text"
							style={styles.move}
						>
							open_with
						</i>
					)
					: null
				}
			</div>
		);
	}

	getScale() {
		switch (true) {
			case this.state.revealed:
				return '1';
			case this.state.hover:
				return '0.5';
			default:
				return '0.4';
		}
	}

	toggleReveal() {
		if (!this.props.editable) {
			this.setState({
				revealed: !this.state.revealed
			});
		}
	}

	getPosition() {
		return this.props.position || {
			personId: this.props.person.id,
			left: 3,
			top: 3,
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
			this.context.dispatch({
				type: "SAVE_PERSON_POSITION",
				position: {
					personId: this.props.person.id,
					left: Math.round(position.left + this.state.deltaMoveX),
					top: Math.round(position.top + this.state.deltaMoveY),
					rotation: Math.round(Math.random() * 40) - 20
				},
				done: () => {
					this.setState({
						moving: false,
						deltaMoveX: 0,
						deltaMoveY: 0,
						lastMoveX: 0,
						lastMoveY: 0,
					});
				}
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
				deltaMoveY: this.state.deltaMoveY + (event.pageY - this.state.lastMoveY) / document.body.clientWidth * 100,
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

	delete() {
		if (confirm('Are you ure to delete person?')) {
			this.context.dispatch({ type: "DELETE_PERSON", personId: this.props.person.id });
		}
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
