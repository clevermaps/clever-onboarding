import {select, event} from "d3-selection";

/**
 * This class is responsible for handling key events while onboarding is running
 * @param {OnboardOptions} options 
 * @param {OnboardModel} model 
 * 
 */
export default class OnboardKeyHandler {
	/**
	 * @param {OnboardOptions} options 
	 * @param {OnboardModel} model 
	 */
	constructor(options, model) {
		/**
		 * @private 
		 * Onboard options
		 */
		this._options = options;
		this._model = model;

		this._onStartBinding = this._model.on("start", this._onStart.bind(this));
		this._onStopBinding = this._model.on("stop", this._onStop.bind(this));
	}
	_onStart() {
		select(document).on("keydown.onboard", this._onKeyDown.bind(this));
		return this;
	}

	_onKeyDown(){
		if(event.key == "ArrowLeft" || event.key == "Backspace"){
			this._model.hasPrev()?this._model.prev():this._model.stop();
		} else if (event.key == "ArrowRight" || event.key == "Enter"){
			this._model.hasNext()?this._model.next():this._model.stop();
		} else if (event.key == "Escape"){
			this._model.stop();
		} else {
			return;
		}

		event.preventDefault();
	}

	_onStop() {
		select(document).on("keydown.onboard", null);
		return this;
	}	

	/**
	 * Destorys Onboard UI  
	 */
	destroy() {
		this._onStop();

		this._onStartBinding.destroy();
		this._onStopBinding.destroy();

		return this;
	}
}