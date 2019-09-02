import { Component } from 'react';

export default class BaseContainer extends Component {

	constructor(props, Controller = null) {
		super(props);

		this.getState = this.getState.bind(this);
		this.getProps = this.getProps.bind(this);
		this.toState = this.toState.bind(this);
		
		const { getState, toState, getProps } = this;

		if(Controller)
			this.controller = new Controller({ getState, getProps, toState });
	}

	toState(state) {
		this.setState({ ...state });
	}

	getState() {
		return this.state;
	}

	getProps() {
		return this.props;
	}

}