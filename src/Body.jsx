
import React from 'react';
import Cards from './Cards';

export default class Body extends React.Component {

	render() {
		return (
			<div style={{ height: "300vw", width: "100%" }}>
				{this.props.globalState.adminView ? <button onClick={() => this.addPerson()}>+</button> : null}
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
			nick: "",
			departement: "",
			profilePicture: "",
		};
		this.context.dispatch({ type: "ADD_PERSON", person: newPerson });
	}

	getNextPersonId() {
		return this.getAllPersons().reduce((maxId, person) => person.id > maxId ? person.id : maxId, 0) + 1;
	}
}
Body.contextTypes = {
	dispatch: React.PropTypes.any
};
