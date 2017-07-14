import {select, event} from "d3-selection";

/**
 * @class
 * @param {Object} options
 */
export default class OnboardKeyHandler {
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

	/**
	 * @public
	 * @returns {OnboarKeyHandler} 
	 */
	_onStart() {
		select(document).on("keydown.onboard", this._onKeyDown.bind(this));
		return this;
	}

	/**
	 * @public
	 * @returns {OnboarKeyHandler} 
	 */
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

	/**
	 * @public
	 * @returns {OnboarKeyHandler} 
	 */
	_onStop() {
		select(document).on("keydown.onboard", null);
		return this;
	}	

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		this._onStop();

		this._onStartBinding.destroy();
		this._onStopBinding.destroy();

		return this;
	}
}