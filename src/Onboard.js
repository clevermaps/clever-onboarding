import Observable from "./utils/Observable";
import * as Defaults from "./OnboardDefaults";
import OnboardRenderer from "./OnboardRenderer";

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
		 * steps
		 */
		this._options.steps = options.steps;

		/**
		 * @private
		 * observable handler
		 */
		this._observable = new Observable([
			
		]);

		/**
		 * @private
		 * OnboardRenderer
		 */
		this._onboardRenderer = new OnboardRenderer(this._options);

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
	 * Sets data
	 * @param {Object} options
	 * @returns {Onboard} returns this widget instance 
	 */
	update(options) {
		if (!this._onboardRenderer.isRendered()) {
			throw "Can't call update() when widget is not rendered, please call .render() first."
		}

		this._onboardRenderer.update(options);

		return this;
	}

	/**
	 * Starts onboarding
	 * @returns {Onboard} returns this widget instance 
	 */
	start() {
		if (!this._onboardRenderer.isRendered()) {
			this._onboardRenderer.render();
		}

		this._onboardRenderer.start();

		return this;
	}


	/**
	 * Stops
	 * @returns {Onboard} returns this widget instance 
	 */
	stop() {
		if (!this._onboardRenderer.isRendered()) {
			this._onboardRenderer.render();
		}

		this._onboardRenderer.stop();

		return this;
	}	
}

export default Onboard;
