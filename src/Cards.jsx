
import React from 'react';
import Card from './Card';

export default class Cards extends React.Component {

	render() {
		return (
			<div>
				{this.props.persons.map((person) => {
					const personPositions = this.props.positions.filter((position) => position.personId == person.id);
					const personPosition = personPositions.length ? personPositions[0] : null;
					const zIndex = this.props.positions.indexOf(personPosition);
					return (
						<Card
							key={person.id}
							person={person}
							position={personPosition}
							editable={this.props.editablePersonIds.indexOf(person.id) !== -1}
							adminView={this.props.adminView}
							zIndex={zIndex}
						/>
					);
				})}
			</div>
		);
	}
}
