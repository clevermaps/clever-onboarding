import style from "./Onboard.css";
import {select, selectAll} from "d3-selection";
import 'd3-transition';

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

		this._steps = model.getSteps().filter(step=>step.showProgress !== false);

		/**
		 * @private 
		 * Number of steps 
		 */
		this._numOfSteps = this._steps.length;		

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
		this._containerEl = select(selector);

		this._renderProgress();
		this._renderSteps();

		this._rendered = true;

		return this;
	}

	_renderProgress(){
		this._progressEl = this._containerEl.append("div").classed(style["window-progress-ct"], true);
	}

	_renderSteps(){
		this._steps.slice(1).forEach(()=>{
			this._progressEl.append("div")
				.classed(style["window-progress-step"], true);
		})
	}	

	_resizeSteps(step){
		var stepWidth = this._getStepWidth(step);
		selectAll("."+style["window-progress-step"])
			.transition()
			.duration(this._options.animationDuration)
			.style("width", stepWidth + "px");
	}

	_getStepWidth(step){
		return (step.windowWidth || this._options.windowWidth) / this._numOfSteps;
	}

	_getProgressWidth(index, step){
		return (step.windowWidth || this._options.windowWidth) * (index + 1) / this._numOfSteps;
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStep(step) {
		if (step.showProgress === false) {
			this._progressEl
				.transition()
				.duration(this._options.animationDuration)
				.style("width", 0+"px");
		
			return;
		} 

		var index = this._steps.indexOf(step);
		var width = this._getProgressWidth(index, step);
		this._progressEl
			.transition()
			.duration(this._options.animationDuration)
			.style("width", width+"px");

		this._resizeSteps(step);
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