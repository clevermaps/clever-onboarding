import style from "./Onboard.css";
import {select, selectAll} from "d3-selection";
import 'd3-transition';
import PositionResolver from "./PositionResolver";
import ArrowRenderer from "./ArrowRenderer";
import ProgressRenderer from "./ProgressRenderer";
import * as Defaults from "./OnboardDefaults";
import * as BoxUtils from "./utils/BoxUtils";
import debounce from "lodash-es/debounce.js";


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

		this._positionResolver = new PositionResolver();
		this._arrowRenderer = new ArrowRenderer(options, model);		
		this._progressRenderer = new ProgressRenderer(options, model);		

		this._onWindowResize = debounce(() => {
			if (this._step){
				this._onStep(this._step);
			}
		}, Defaults.WINDOW_RESIZE_DEBOUNCE_TIME);

		window.addEventListener("resize", this._onWindowResize);		
		
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

		this._renderWindow();
		this._arrowRenderer.render(selector);
		this._progressRenderer.render(this._windowEl.node());
		this._rendered = true;

		return this;
	}

	_renderWindow(){
		this._windowEl = this._containerEl.append("div")
			.attr("class", style["window"] + " " + this._options.windowClassName)
			.style("width", this._options.windowWidth + "px");

		this._nextBtnEl = this._windowEl.append("div")
			.on("click", this._onNextClick.bind(this))
			.attr("class", style["window-next-btn"] + " " + Defaults.NEXT_BUTTON_CLASS_NAME);

		this._nextBtnTextEl = this._nextBtnEl.append("span")
			.attr("class",style["window-next-btn-text"])
			.html(this._options.nextText);

		this._nextBtnEl.on("mouseover", ()=>{
			this._nextBtnEl.classed(style["window-next-btn-hover"], true);
		});

		this._nextBtnEl.on("mouseout", ()=>{
			this._nextBtnEl.classed(style["window-next-btn-hover"], false);
		})

		this._nextBtnIconEl = this._nextBtnEl.append("div").attr("class",style["window-btn-icon"]+" zmdi zmdi-long-arrow-right");

		this._prevBtnEl = this._windowEl.append("div")
			.attr("class", style["window-prev-btn"] + " " + Defaults.PREV_BUTTON_CLASS_NAME)
			.on("click", this._onPrevClick.bind(this))
			.html(this._options.prevText)

		this._prevBtnEl.append("div").attr("class",style["window-btn-icon"]+" zmdi zmdi-long-arrow-left");			

		this._titleEl = this._windowEl.append("div")
			.attr("class", style["window-title"] + " " +Defaults.WINDOW_TITLE_CLASS_NAME)

		this._bodyEl = this._windowEl.append("div")
			.attr("class", style["window-body"] + " " + Defaults.WINDOW_BODY_CLASS_NAME)

		this._closeEl = this._windowEl.append("div")
			.attr("class", style["window-close"] + " zmdi zmdi-close")
			.on("click", this._onCloseClick.bind(this))
	}

	_onCloseClick(){
		this._model.stop();
	}

	_onNextClick(){
		this._nextBtnEl.classed(style["window-next-btn-hover"], false);

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
		this._step = step;

		this._titleEl.html(step.title);
		this._bodyEl.html(step.text);

		this._prevBtnEl.classed(style["window-button-has-prev"], this._model.hasPrev());
		this._nextBtnEl.classed(style["window-button-has-next"], this._model.hasNext());
		this._nextBtnTextEl.html(step.nextText || this._options.nextText)
		this._windowEl.attr("class", style["window"] + " " + (step.windowClassName || this._options.windowClassName))
		this._windowEl.style("width", (step.windowWidth || this._options.windowWidth) + "px");

		if (!step.selector) {
			this._windowEl.transition().duration(this._options.animationDuration)
				.style("left", null)
				.style("top", null);

			return;
		}

		var selection = selectAll(step.selector);

		var targetBox = BoxUtils.getTargetBox(selection);
		var windowBox = BoxUtils.getBox(this._windowEl.node());
		var windowPosition = this._positionResolver.getWindowPosition(targetBox, windowBox, this._arrowRenderer.getArrowBox());

		this._windowEl.transition().duration(this._options.animationDuration)
			.style("left", windowPosition.left+"px")
			.style("top", windowPosition.top+"px");

		this._windowEl.classed(style["window-"+windowPosition.position], true);

		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStop() {
		this._windowEl.style("display", "none");
		this._step = null;
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

		this._step = null;

		this._progressRenderer.destroy();
		this._arrowRenderer.destroy();
		window.removeEventListener("resize", this._onWindowResize);

		return this;
	}
}