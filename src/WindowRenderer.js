import style from "./Onboard.css";
import * as d3 from "d3";

/**
 * @class
 * @param {Object} options
 */
export default class WindowRenderer {
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

		this._model = model;

		this._onStartBinding = this._model.on("start", this._onStart.bind(this));
		this._onStepBinding = this._model.on("step", this._onStep.bind(this));
		this._onStopBinding = this._model.on("stop", this._onStop.bind(this));
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
			.on("click", this._onNextClick.bind(this))
			.attr("class", style["window-next-btn"]);

		this._nextBtnTextEl = this._nextBtnEl.append("span")
			.attr("class",style["window-next-btn-text"])
			.html(this._options.nextText);

		this._nextBtnIconEl = this._nextBtnEl.append("div").attr("class",style["window-btn-icon"]+" zmdi zmdi-long-arrow-right");

		this._prevBtnEl = this._windowEl.append("div")
			.attr("class", style["window-prev-btn"])
			.on("click", this._onPrevClick.bind(this))
			.html(this._options.prevText)

		this._prevBtnEl.append("div").attr("class",style["window-btn-icon"]+" zmdi zmdi-long-arrow-left");			

		this._titleEl = this._windowEl.append("div")
			.attr("class", style["window-title"])

		this._bodyEl = this._windowEl.append("div")
			.attr("class", style["window-body"])
	}

	_onNextClick(){
		if (this._model.hasNext()){
			this._model.next();
		} else {
			this._model.stop();
		}
	}

	_onPrevClick(){
		this._model.prev();
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStart() {
		this._windowEl.style("display", "block");
		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStep(step) {
		this._titleEl.html(step.title);
		this._bodyEl.html(step.text);

		this._prevBtnEl.classed(style["window-button-has-prev"], this._model.hasPrev());
		this._nextBtnEl.classed(style["window-button-has-next"], this._model.hasNext());

		if (this._model.hasNext()){
			this._nextBtnTextEl.html(this._options.nextText)
		} else {
			this._nextBtnTextEl.html(this._options.understandText)
		}

		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStop() {
		this._windowEl.style("display", "none");
		return this;
	}	

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		this._onStartBinding.destroy();
		this._onStepBinding.destroy();
		this._onStopBinding.destroy();

		return this;
	}
}