import style from "./Onboard.css";
import {select, selectAll} from "d3-selection";
import debounce from "lodash-es/debounce.js";
import * as Defaults from "./OnboardDefaults";

/**
 * @class
 * Onboard class
 * @param {Object} options
 */
export default class MaskRenderer {
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

		/**
		 * @private
		 */
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
		this._containerEl = select(selector || document.body);

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

		this._onWindowResize = debounce(() => {
			var size = this._getViewSize();
			this._svgEl.attr("width", size.width);
			this._svgEl.attr("height", size.height);

			if (this._step){
				this._onStep(this._step);
			}
		}, Defaults.WINDOW_RESIZE_DEBOUNCE_TIME);

		window.addEventListener("resize", this._onWindowResize);
	}

	_clearSteps(){
		this._stepElements.forEach(element=>element.remove());
	}

	/**
	 * @private
	 */
	_renderStep(step){
		if (!step.selector) return;
		var selection = selectAll(step.selector);
		
		selection.nodes().forEach(element=>{
			this._stepElements.push(this._renderStepElement(element, step));
		});
	}

	_renderStepElement(element, step){
		var shape = step.shape || {
			type:"rectangle"
		};

		if (element.tagName == "path"){
			return this._renderPathMask(element, step);
		} else if (shape.type == "circle"){
			return this._renderCircleMask(element, step);
		} else {
			return this._renderRectangleMask(element, step);
		}
	}
	_getBorderRadius(el){
		return parseFloat(window.getComputedStyle(el, null).getPropertyValue("border-top-left-radius"));
	}

	_getBox(element){
		var box = element.getBoundingClientRect();
		return {
			top:box.top +  + document.body.scrollTop,
			left:box.left +  + document.body.scrollLeft,
			width: box.width,
			height:box.height
		}
	}

	_renderRectangleMask(element, step){
		var box = this._getBox(element);		
		var borderRadius = this._getBorderRadius(element);
		var shape = step.shape || {};
		var offset = shape.offset || [0,0];

		if (step.shape && step.shape.radius){
			borderRadius = step.shape.radius;
		}

		var stepEl = this._maskEl
			.append("rect")
				.attr("fill", "black")
				.attr("x", box.left + offset[0])
				.attr("y", box.top + offset[1])
				.attr("rx", borderRadius)
				.attr("ry", borderRadius)
				.attr("width", shape.width || box.width)
				.attr("fill-opacity", 1)
				.attr("stroke-opacity", 1)
				.attr("stroke-width", shape.strokeWidth || 0)
				.attr("stroke", "black")
				.attr("height", shape.height || box.height)

		return stepEl;
	}

	_renderCircleMask(element, step){
		var box = this._getBox(element);
		var cx = box.left + box.width / 2;
		var cy = box.top + box.height / 2;
		var shape = step.shape || {};
		var offset = shape.offset || [0,0];

		var stepEl = this._maskEl
			.append("circle")
			.attr("r", step.shape.radius || box.width / 2)
			.attr("fill", "black")
			.attr("fill-opacity", 1)
			.attr("stroke-width", shape.strokeWidth || 0)
			.attr("stroke-opacity", 1)
			.attr("stroke", "black")
			.attr("cx", cx + offset[0])
			.attr("cy", cy + offset[1])

		return stepEl;
	}

	_renderPathMask(element, step){
		var svgElement = element.parentElement; 
		while (svgElement && svgElement.tagName != "svg"){
			svgElement = svgElement.parentElement;
		}

		var box = this._getBox(svgElement);

		var stepEl = this._maskEl
			.append("g")
			.attr("transform", "translate("+box.left+", "+box.top+")")
			.append("path")
				.attr("fill", "black")
				.attr("fill-opacity", 1)
				.attr("stroke-width", step.shape?step.shape.strokeWidth||0:0)
				.attr("stroke", "black")
				.attr("d", select(element).attr("d"))
			
		
		return stepEl;
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStart() {
		this._svgEl.style("display", "block");
		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStep(step) {
		this._step = step;
		this._clearSteps();
		this._renderStep(step);
		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStop() {
		this._step = null;
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

		this._clearSteps();
		this._step = null;
		this._onStartBinding.destroy();
		this._onStepBinding.destroy();
		this._onStopBinding.destroy();

		return this;
	}
}