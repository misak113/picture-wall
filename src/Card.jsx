
import React from 'react';

export default class Card extends React.Component {

	render() {
		const person = this.props.person;
		const position = this.props.position;
		if (!position) {
			return null;
		}
		return (
			<div style={{
				border: "1px solid black",
				textAlign: "center",
				position: "absolute",
				fontSize: "0.4em",
				left: position.left + "%",
				top: position.top + "%",
				width: "6.7vw",
				height: "6.7vw",
			}}>
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
}
