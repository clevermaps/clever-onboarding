import Observable from "./utils/Observable";
import * as Defaults from "./OnboardDefaults";
import OnboardRenderer from "./OnboardRenderer";
import OnboardModel from "./OnboardModel";

/**
 * @private 
 * @param {*} optionValue option value 
 * @param {*} defaultOptionValue default option value 
 * @returns option or default option value 
 */
function getOptionValue(optionValue, defaultOptionValue) {
	return typeof optionValue == "undefined" ? defaultOptionValue : optionValue;
}

/**
 * @class
 * Main onboard class
 * @param {Object} options
 */
class Onboard {
	constructor(options) {
		/**
		 * @private
		 * Options property exposing widget's options
		 */
		this._options = {};

		/**
		 * @public
		 * fill color
		 */
		this._options.fillColor = getOptionValue(options.fillColor, Defaults.FILL_COLOR);		

		/**
		 * @public
		 * fill opacity
		 */
		this._options.fillOpacity = getOptionValue(options.fillOpacity, Defaults.FILL_OPACITY);

		/**
		 * @public
		 * Next text
		 */
		this._options.nextText = getOptionValue(options.nextText, Defaults.NEXT_TEXT);		

		/**
		 * @public
		 * Understand text
		 */
		this._options.understandText = getOptionValue(options.understandText, Defaults.UNDERSTAND_TEXT);		

		/**
		 * @public
		 * animation duration
		 */
		this._options.animationDuration = getOptionValue(options.animationDuration, Defaults.ANIMATION_DURATION);		

		/**
		 * @public
		 * steps
		 */
		this._options.steps = options.steps;

		/**
		 * @private
		 * observable handler
		 */
		this._observable = new Observable([
			
		]);

		this._model = new OnboardModel(this._options);

		/**
		 * @private
		 * OnboardRenderer
		 */
		this._onboardRenderer = new OnboardRenderer(this._options, this._model);

		this.render();
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
	 * Destroys widget
	 * @returns {Onboard} returns this widget instance
	 */
	destroy() {
		this._observable.destroy();
		this._onboardRenderer.destroy();
		this._options = null;
		this._model.destroy();

		return this;
	}	

	/**
	 * Render logic of this widget
	 * @param {String|DOMElement} selector selector or DOM element 
	 * @returns {Onboard} returns this widget instance
	 */
	render(selector) {
		this._onboardRenderer.render(selector);
		return this;
	}

	/**
	 * Starts onboarding
	 * @returns {Onboard} returns this widget instance 
	 */
	start() {
		this._model.start();
		return this;
	}


	/**
	 * Stops
	 * @returns {Onboard} returns this widget instance 
	 */
	stop() {
		this._model.stop();
		return this;
	}	
}

export default Onboard;
