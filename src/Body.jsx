
import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './Cards';
import * as styles from './BodyStyle';

export default class Body extends React.Component {

	render() {
		const settings = this.props.globalState.settings || {};
		return (
			<div style={{
				...styles.body,
				backgroundImage: "url('picture/" + settings.background + "')",
			}}>
				{
					this.props.globalState.adminView
					? (
						<a
							onClick={() => this.addPerson()}
							style={styles.addPerson}
							className="btn-floating btn-large waves-effect waves-light red"
						>
							<i className="material-icons">add</i>
						</a>
					)
					: null
				}
				{
					this.props.globalState.adminView
					? (
						<input ref="background-input" className="right" type="file" onChange={(event) => this.uploadBackground(event)}/>
					)
					: null
				}
				<Cards
					persons={this.getAllPersons()}
					positions={this.props.globalState.positions}
					editablePersonIds={this.props.globalState.editablePersonIds}
					adminView={this.props.globalState.adminView}
				/>
			</div>
		);
	}

	getAllPersons() {
		return [...this.props.globalState.persons, ...this.props.globalState.newPersons];
	}

	addPerson() {
		const newPerson = {
			id: this.getNextPersonId(),
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			nick: "",
			departement: "",
			description: "",
			profilePicture: "",
		};
		this.context.dispatch({ type: "ADD_PERSON", person: newPerson });
	}

	getNextPersonId() {
		return this.getAllPersons().reduce((maxId, person) => person.id > maxId ? person.id : maxId, 0) + 1;
	}

	uploadBackground(event) {
		const backgroundInput = ReactDOM.findDOMNode(this.refs['background-input']);
		this.context.dispatch({
			type: "UPLOAD_IMAGE",
			file: backgroundInput.files[0],
			done: (fileName) => {
				this.context.dispatch({
					type: "SAVE_SETTINGS",
					settings: {
						...this.props.globalState.settings,
						background: fileName,
					}
				});
			},
		})
	}
}
Body.contextTypes = {
	dispatch: React.PropTypes.any
};
