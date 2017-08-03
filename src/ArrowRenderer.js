import style from "./Onboard.css";
import PositionResolver from "./PositionResolver";
import * as BoxUtils from "./utils/BoxUtils";
import * as Defaults from "./OnboardDefaults";
import debounce from "lodash-es/debounce.js";
import {select, selectAll} from "d3-selection";
import 'd3-transition';

/**
 * ArrowRenderer is responsible for rendering arrows pointing to windows
*
* @param {OnboardOptions} options 
* @param {OnboardModel} model 
*
 */
export default class ArrowRenderer {

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

		this._onWindowResize = debounce(() => {
			if (this._step){
				this._onStep(this._step);
			}
		}, Defaults.WINDOW_RESIZE_DEBOUNCE_TIME);

		window.addEventListener("resize", this._onWindowResize);		
	}

	/**
	 * Returns box for the arrow
	 * @return {Box}
	 */
	getArrowBox(){
		return this._arrowBox;
	}

	/**
	 * Returns whether ArrowRenderer has been rendered or not
	 * @returns {boolean} true if ArrowRenderer has been rendered
	 */
	isRendered() {
		return this._rendered;
	}

	/**
	 * Renders this widget
	 * @param {String|HTMLElement} selector selector or DOM element 
	 * @returns {ArrowRenderer} returns this renderer instance
	 */
	render(selector) {
		// get container element using selector or given element
		this._containerEl = select(selector || document.body);
		this._renderArrow();
		this._rendered = true;

		return this;
	}

	_renderArrow(){
		this._arrowEl = this._containerEl.append("div")
			.attr("class", style["arrow"]+" "+style["arrow-bottom-right"])

		this._arrowBox = BoxUtils.getBox(this._arrowEl.node());
	}

	_onStart() {
		this._arrowEl.style("display", "block");
	}	

	/**
	 * Render loging for arrow for each step
	 * @private
	 * @param {StepOptions} step
	 */
	_onStep(step) {
		if (!step.selector){
			this._arrowEl.style("visibility", "hidden");
			return;
		} else {
			this._arrowEl.style("visibility", "visible");
		}

		this._step = step;

		var selection = selectAll(step.selector);
		var targetBox = BoxUtils.getTargetBox(selection);

		if (!targetBox) {
			this._arrowEl.style("display", "none");
			return;
		}

		var arrowPosition = this._positionResolver.getArrowPosition(targetBox, this._arrowBox);

		this._arrowEl.transition().duration(0 /*this._options.animationDuration*/)
			.style("top", arrowPosition.top+"px")
			.style("left", arrowPosition.left+"px");

		// epxerimental fading when moving arrow
		this._arrowEl
			.style("opacity", 0)
			.transition("2").duration(this._options.animationDuration)
			.style("opacity", 1);

		this._arrowEl.attr("class", style["arrow"]+" "+style["arrow-"+arrowPosition.position]);
	}	

	_onStop() {
		this._arrowEl.style("display", "none");
		this._step = null;
	}	

	/**
	 * Destroys arrow renderer
	 */
	destroy() {
		this._onStartBinding.destroy();
		this._onStepBinding.destroy();
		this._onStopBinding.destroy();

		this._step = null;
		window.removeEventListener("resize", this._onWindowResize);	

		if (this._arrowEl){
			this._arrowEl.remove();
		}

		return this;
	}
}