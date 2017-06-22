import style from "./Onboard.css";
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
		 * Number of steps 
		 */
		this._numOfSteps = this._model.getSteps().length;		

		// only show when number of steps is > than 1
		if (this._numOfSteps>1){
			this._onStepBinding = this._model.on("step", this._onStep.bind(this));
		}
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
		this._containerEl = d3.select(selector);

		this._renderProgress();
		this._renderSteps();

		this._rendered = true;

		return this;
	}

	_renderProgress(){
		this._progressEl = this._containerEl.append("div").classed(style["window-progress-ct"], true);
	}

	_renderSteps(){
		var stepWidth = this._getStepWidth();

		this._model.getSteps().forEach(()=>{
			this._progressEl.append("div")
				.classed(style["window-progress-step"], true)
				.style("width", stepWidth+"px");
		})
		
	}	

	_getStepWidth(){
		return this._options.windowWidth / this._numOfSteps;
	}

	_getProgressWidth(index){
		return this._options.windowWidth * (index + 1) / this._numOfSteps;
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStep(step, index) {
		var width = this._getProgressWidth(index);
		this._progressEl
			.transition()
			.duration(this._options.animationDuration)
			.style("width", width+"px");
	}	

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		if (this._rendered){
			this._progressEl.remove();
		}

		if (this._onStepBinding){
			this._onStepBinding.destroy();
		}
		
		return this;
	}
}