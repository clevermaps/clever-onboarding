import style from "./Onboard.css";
import * as d3 from "d3";

/**
 * @class
 * Onboard class
 * @param {Object} options
 */
export default class MaskRenderer {
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
		 * Mask Element
		 */
		this._svgEl = null;		

		/**
		 * @private 
		 * Step elements
		 */
		this._stepElements = [];

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

		this._renderMask();
		this._rendered = true;

		return this;
	}

	_getViewSize(){
		return {
			width: Math.max(document.documentElement.offsetWidth, document.documentElement.clientWidth),
			height: Math.max(document.documentElement.offsetHeight, document.documentElement.clientHeight)
		}
	}

	_renderMask(){
		var size = this._getViewSize();
		// render SVG
		this._svgEl = this._containerEl.append("svg")
			.attr("class", style["svg"])
			.attr("width", size.width)
			.attr("height", size.height)

		// defs el
		this._defsEl = this._svgEl.append("defs");
		this._maskEl = this._defsEl.append("mask")
			.attr("class", style["mask"])
			.attr("id", "onboarding-mask")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("x", 0)
			.attr("y", 0)

		this._maskBg = this._maskEl.append("rect")
			.attr("class", style["bg"])
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", "white")

		this._bgEl = this._svgEl.append("rect")
			.attr("class", style["bg"])
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("x", 0)
			.attr("y", 0)
			.attr("mask", "url(#onboarding-mask)")
			.attr("fill", this._options.fillColor)
			.attr("fill-opacity", this._options.fillOpacity)

		this._onWindowResize = ()=>{
			var size = this._getViewSize();
			this._svgEl.attr("width", size.width);
			this._svgEl.attr("height", size.height);
		}	

		window.addEventListener("resize", this._onWindowResize);
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	start() {
		this._svgEl.style("display", "block");
		this._clearSteps();
		this._renderSteps();
		return this;
	}	
	_clearSteps(){
		this._stepElements.forEach(element=>element.remove());
	}

	/**
	 * @private
	 */
	_renderSteps(){
		var steps = this._options.steps || [];
		steps.forEach(this._renderStep.bind(this));
	}

	/**
	 * @private
	 */
	_renderStep(step){
		let selection = step.selection; 
		selection.nodes().forEach(element=>{
			this._stepElements.push(this._renderStepElement(element, step));
		});
	}

	_renderStepElement(element, step){
		var shape = step.shape || "rectangle";
			
		if (shape == "circle"){
			return this._renderCircleMask(element, step);
		} else {
			return this._renderRectangleMask(element, step);
		}
	}

	_renderRectangleMask(element, step){
		var box = element.getBoundingClientRect();		

		var stepEl = this._maskEl
			.append("rect")
				.attr("fill", "black")
				.attr("x", box.left)
				.attr("y", box.top)
				.attr("width", box.width)
				.attr("stroke-width", step.shape?step.shape.offset||0:0)
				.attr("stroke", "black")
				.attr("height", box.height)

		return stepEl;
	}

	_renderCircleMask(element, step){
		var box = element.getBoundingClientRect();		
		var cx = box.left + box.width / 2;
		var cy = box.top + box.height / 2;

		var stepEl = this._maskEl
			.append("circle")
			.attr("r", 0)
			.attr("fill", "black")
			.attr("cx", cx)
			.attr("cy", cy)

		stepEl.transition().duration(250).attr("r", step.shape.radius || box.width /2)
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	stop() {
		this._svgEl.style("display", "none");
		return this;
	}

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		if (this._rendered){
			window.removeEventListener("resize", this._onWindowResize);
		}

		return this;
	}
}