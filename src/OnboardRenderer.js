import Observable from "./utils/Observable";
import MaskRenderer from "./MaskRenderer";
import WindowRenderer from "./WindowRenderer";
import * as d3 from "d3";

/**
 * @class
 * Onboard class
 * @param {Object} options
 */
export default class OnboardRenderer {
	constructor(options, model) {
		/**
		 * @private 
		 * Onboard options
		 */
		this._options = options;

		/**
		 * @private 
		 * DOM container of this widget
		 */
		this._containerEl = null;
		/**
		 * @private
		 * true if Onboard has been rendered
		 */
		this._rendered = false;

		/**
		 * @private 
		 * Model
		 */
		this._model = model;

		/**
		 * @private
		 * observable handler
		 */
		this._observable = new Observable([
			
		]);		

		this._maskRenderer = new MaskRenderer(options, model);
		this._windowRenderer = new WindowRenderer(options, model);
	}

	/**
	 * @public
	 * Returns whether Onboard has been rendered or not
	 * @returns {boolean} true if Onboard has been rendered
	 */
	isRendered() {
		return this._rendered;
	}

	/**
	 * @public
	 * Render logic of this widget
	 * @param {String|DOMElement} selector selector or DOM element 
	 * @returns {Onboard} returns this widget instance
	 */
	render(selector) {
		// get container element using selector or given element
		this._containerEl = d3.select(selector || document.body);

		this._maskRenderer.render(selector);
		this._windowRenderer.render(selector);

		this._rendered = true;

		return this;
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

		return this;
	}
}