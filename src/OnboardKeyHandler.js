import * as d3 from "d3";

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
		d3.select(document).on("keydown.onboard", this._onKeyDown.bind(this));
		return this;
	}

	/**
	 * @public
	 * @returns {OnboarKeyHandler} 
	 */
	_onKeyDown(){
		if(d3.event.key == "ArrowLeft"){
			this._model.hasPrev()?this._model.prev():this._model.stop();
		} else if (d3.event.key == "ArrowRight"){
			this._model.hasNext()?this._model.next():this._model.stop();
		} else if (d3.event.key == "Backspace" || d3.event.key == "Escape"){
			this._model.stop();
		}
	}

	/**
	 * @public
	 * @returns {OnboarKeyHandler} 
	 */
	_onStop() {
		d3.select(document).on("keydown.onboard", null);
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