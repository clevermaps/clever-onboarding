import Observable from "./utils/Observable";

/**
 * @param {OnboardOptions} options 
 * Manages onboard data model
 */
export default class OnboardModel {
	/**
	 * @param {OnboardOptions} options 
	 */	
	constructor(options) {
		/**
		 * @private 
		 * Onboard options
		 */
		this._steps = options.steps || [];
		this._currentStep = null;
		this._currentStepIndex = -1;

		/**
		 * @private
		 * observable handler
		 */
		this._observable = new Observable([
			/**
			 * Fires when onboarding starts.
			 *
			 * @event Onboard#start
			 * @memberof Onboard
             * @instance
			 * @type {object}
			 * @property {Object} step.
			 * @property {number} step index.
			 */
			"start",
			/**
			 * Fires when onboarding step changes.
			 *
			 * @event Onboard#stop
			 * @memberof Onboard
			 * @type {object}
			 * @property {Object} step.
			 * @property {number} step index.
			 */
			"stop",
			/**
			 * Fires when onboarding finishes.
			 *
			 * @event Onboard#stop
			 * @memberof Onboard
			 * @type {object}
			 * @property {Object} step.
			 * @property {number} step index.
			 */
			"step"
		]);		
	}

	/**
	 * Returns steps
	 * @return {StepOptions[]} steps
	 */
	getSteps(){
		return this._steps;
	}

	/**
	 * Starts onboarding
	 */
	start(){
		this._currentStepIndex = 0;
		this._currentStep = this._steps[this._currentStepIndex];
		this._observable.fire("start", this._currentStep, this._currentStepIndex);
		this._observable.fire("step", this._currentStep, this._currentStepIndex);
	}

	/** 
	 * Stops onboarding
	 */
	stop(){
		this._observable.fire("stop", this._currentStep, this._currentStepIndex);
		this._currentStep = null;
		this._currentStepIndex = -1;
	}	

	/**
	 * Switches to the next step
	 */
	next(){
		if (this.hasNext()){
			this._currentStep = this._steps[++this._currentStepIndex];
			this._observable.fire("step", this._currentStep, this._currentStepIndex);
		}
	}

	/**
	 * Switches to the previous step
	 */
	prev(){
		if (this.hasPrev()){
			this._currentStep = this._steps[--this._currentStepIndex];
			this._observable.fire("step", this._currentStep, this._currentStepIndex);
		}
	}

	/**
	 * Returns true if there is next step
	 * @return {boolean} true if there is next step
	 */
	hasNext(){
		return this._steps.length > this._currentStepIndex +1;
	}

	/**
	 * Returns true if there is previous step
	 * @return {boolean} true if there is previous step
	 */
	hasPrev(){
		return this._currentStepIndex > 0;
	}

	/**
	 * Binds event
	 * @param {string} eventName event name
	 * @param {Function} handler event handler
	 * @returns {OnboardModel} returns this widget instance
	 */
	on(eventName, handler) {
		this._observable.on(eventName, handler);
		return this;
	}

	/**
	 * Unbinds event
	 * @param {string} eventName event name
	 * @param {Function} [handler] event handler
	 * @returns {OnboardModel} returns this widget instance
	 */
	off(eventName, handler) {
		this._observable.off(eventName, handler);
		return this;
	}	

	/**
	 * Destorys OnboardModel  
	 */
	destroy() {
		this._observable.destroy();
		this._currentStep = null;

		return this;
	}
}