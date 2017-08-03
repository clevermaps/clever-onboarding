import MaskRenderer from "./MaskRenderer";
import WindowRenderer from "./WindowRenderer";
import {select} from "d3-selection";

/**
 * OnboardRenderer class is responsible for UI rendering for onboarding. It manages other renderers.
 * 
 * @param {OnboardOptions} options 
 * @param {OnboardModel} model 
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
		 * Mask renderer
		 */
		this._maskRenderer = new MaskRenderer(options, model);
		/**
		 * @private 
		 * Window renderer
		 */
		this._windowRenderer = new WindowRenderer(options, model);
	}

	/**
	 * Returns whether Onboard has been rendered or not
	 * @returns {boolean} true if OnboardRenderer has been rendered
	 */
	isRendered() {
		return this._rendered;
	}

	/**
	 * Render logic of this widget
	 * @param {String|HTMLElement} selector selector or HTML element 
	 * @returns {OnboardRenderer} returns this renderer instance
	 */
	render(selector) {
		// get container element using selector or given element
		this._containerEl = select(selector || document.body);
		this._maskRenderer.render(selector);
		this._windowRenderer.render(selector);
		this._rendered = true;

		return this;
	}

	/**
	 * Destorys this renderer 
	 */
	destroy() {
		this._maskRenderer.destroy();
		this._windowRenderer.destroy();
		return this;
	}
}