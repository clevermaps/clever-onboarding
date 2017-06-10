import style from "./Onboard.css";
import * as d3 from "d3";

/**
 * @class
 * @param {Object} options
 */
export default class WindowRenderer {
	constructor(options) {
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

		this._renderWindow();
		this._rendered = true;

		return this;
	}

	_renderWindow(){
		this._windowEl = this._containerEl.append("div")
			.attr("class", style["window"])

		this._nextBtnEl = this._windowEl.append("div")
			.attr("class", style["window-next-btn"])
			.html("Next")

		this._prevBtnEl = this._windowEl.append("div")
			.attr("class", style["window-prev-btn"])
			.html("Previous")

		this._titleEl = this._windowEl.append("div")
			.attr("class", style["window-title"])
	}

	/**
	 * @public
	 * @returns {WindowRenderer} 
	 */
	start() {
		this._windowEl.style("display", "block");
		return this;
	}	

	/**
	 * @public
	 * @returns {WindowRenderer} 
	 */
	stop() {
		this._windowEl.style("display", "none");
		return this;
	}		

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		return this;
	}
}