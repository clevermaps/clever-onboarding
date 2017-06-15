import Observable from "./utils/Observable";

/**
 * @class
 * @param {Object} options
 */
export default class OnboardModel {
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
			"start",
			"stop",
			"step"
		]);		
	}

	getSteps(){
		return this._steps;
	}

	start(){
		this._currentStepIndex = 0;
		this._currentStep = this._steps[this._currentStepIndex];
		this._observable.fire("start", this._currentStep, this._currentStepIndex);
		this._observable.fire("step", this._currentStep, this._currentStepIndex);
	}

	stop(){
		this._observable.fire("stop");
		this._currentStep = null;
		this._currentStepIndex = -1;
	}	

	next(){
		if (this.hasNext()){
			this._currentStep = this._steps[++this._currentStepIndex];
			this._observable.fire("step", this._currentStep, this._currentStepIndex);
		}
	}

	prev(){
		if (this.hasPrev()){
			this._currentStep = this._steps[--this._currentStepIndex];
			this._observable.fire("step", this._currentStep, this._currentStepIndex);
		}
	}

	hasNext(){
		return this._steps.length > this._currentStepIndex +1;
	}

	hasPrev(){
		return this._currentStepIndex > 0;
	}

	/**
	 * Bind widget event
	 * @param {String} event event name
	 * @param {Function} handler event handler
	 * @returns {Onboard} returns this widget instance
	 */
	on(eventName, handler) {
		this._observable.on(eventName, handler);
		return this;
	}

	/**
	 * Unbind widget event
	 * @param {String} event event name
	 * @param {Function} [handler] event handler
	 * @returns {Onboard} returns this widget instance
	 */
	off(eventName, handler) {
		this._observable.off(eventName, handler);
		return this;
	}	

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		this._observable.destroy();
		this._currentStep = null;

		return this;
	}
}