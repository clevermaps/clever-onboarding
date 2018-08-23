import Observable from "./utils/Observable";
import * as Defaults from "./OnboardDefaults";
import OnboardRenderer from "./OnboardRenderer";
import OnboardModel from "./OnboardModel";
import OnboardKeyHandler from "./OnboardKeyHandler";

/**
 * @private 
 * @param {*} optionValue option value 
 * @param {*} defaultOptionValue default option value 
 * @return option or default option value 
 */
function getOptionValue(optionValue, defaultOptionValue) {
	return typeof optionValue == "undefined" ? defaultOptionValue : optionValue;
}

/**
* Onboard class used to start, control and end app walkthrough experience
* @param {OnboardOptions} options 
* @example
* const onboarding = new CleverOnboarding({
*   nextText:"Next"
* });
* 
* onboarding.start([
* 		{
* 			selector:".menu-element",
* 			title:"Step 1 title",
* 			text:"Step 1 text."
* 			
* 		},
* 		{
* 			selector:".sidebar-element",
* 			title:"Step 2 title",
* 			text:"Step 2 text."
* 			
* 		}
* 	]);
*/
 
class CleverOnboarding {
	/**
	 * @param {OnboardOptions} options 
	 */
	
	constructor(options) {
		/**
		 * @private
		 * Options property exposing widget's options
		 */
		this._options = {};
		this._options.fillColor = getOptionValue(options.fillColor, Defaults.FILL_COLOR);		
		this._options.fillOpacity = getOptionValue(options.fillOpacity, Defaults.FILL_OPACITY);
		this._options.nextText = getOptionValue(options.nextText, Defaults.NEXT_TEXT);		
		this._options.windowClassName = getOptionValue(options.windowClassName, Defaults.WINDOW_CLASS_NAME);		
		this._options.animationDuration = getOptionValue(options.animationDuration, Defaults.ANIMATION_DURATION);		
		this._options.windowWidth = getOptionValue(options.windowWidth, Defaults.WINDOW_WIDTH);				
		this._options.steps = options.steps;

		/**
		 * @private
		 * observable handler
		 */
		this._observable = new Observable([
			/**
			 * Fires when onboarding starts.
			 *
			 * @event Onboard#start
			 * @memberof Onboard
			 * @type {Object}
			 * @property {Object} step
			 * @property {number} stepIndex
			 */
			"start",
			/**
			 * Fires when onboarding step changes.
			 *
			 * @event Onboard#stop
			 * @memberof Onboard
			 * @type {Object}
			 * @property {Object} step
			 * @property {number} stepIndex
			 */
			"step",
			/**
			 * Fires when user clicks on close button.
			 *
			 * @event Onboard#closeClick
			 * @memberof Onboard
			 */
			"closeClick",
			/**
			 * Fires when onboarding finishes.
			 *
			 * @event Onboard#step
			 * @memberof Onboard
			 * @type {Object}
			 * @property {Object} step
			 * @property {number} stepIndex
			 */
			"stop"
		]);

		/**
		 * @private
		 * model
		 */
		this._model = new OnboardModel(this._options);

		this._model.on("start", (step, index)=>{
			this._observable.fire("start", {
				step:step, 
				index:index
			});
		});

		this._model.on("stop", (step, index)=>{
			this._observable.fire("stop", {
				step:step, 
				index:index
			});
		});

		this._model.on("step", (step, index, lastStep, lastIndex)=>{
			this._observable.fire("step", {
				step,
				index,
                lastStep,
                lastIndex
			});
		});

		/**
		 * @private
		 * renderer
		 */
		this._onboardRenderer = new OnboardRenderer(this._options, this._model);

		/**
		 * @private
		 * key handler
		 */
		this._onboardKeyHandler = new OnboardKeyHandler(this._options, this._model);

		this._onboardRenderer.on("closeClick", (step, index)=>{
			this._observable.fire("closeClick", {
                step,
                index,
            });
		});

		this.render();
	}

	/**
	 * Binds widget event
	 * @param {string} eventName event name
	 * @param {Function} handler event handler
	 * @return {Onboard} returns this widget instance
	 */
	on(eventName, handler) {
		this._observable.on(eventName, handler);
		return this;
	}

	/**
	 * Unbinds widget event
	 * @param {string} eventName event name
	 * @param {Function} [handler] event handler
	 * @return {Onboard} returns this widget instance
	 */
	off(eventName, handler) {
		this._observable.off(eventName, handler);
		return this;
	}	

	/**
	 * Destroys this widget
	 * @return {Onboard} returns this widget instance
	 */
	destroy() {
		this._observable.destroy();
		this._onboardRenderer.destroy();
		this._options = null;
		this._model.destroy();
		this._onboardKeyHandler.destroy();

		return this;
	}	

	/**
	 * Renders this widget
	 * @param {string|HTMLElement} selector selector or DOM element 
	 * @return {Onboard} returns this widget instance
	 */
	render(selector) {
		this._onboardRenderer.render(selector);
		return this;
	}

	/**
	 * Starts onboarding
	 * @param {StepOptions[]} steps 
	 * @return {Onboard} returns this widget instance 
	 */
	start(steps) {
		this._model.start(steps);
		return this;
	}


	/**
	 * Stops onboarding
	 * @return {Onboard} returns this widget instance 
	 */
	stop() {
		this._model.stop();
		return this;
	}	
}

/**
 * Options for the main Onboard instance
 *
 * @typedef {Object} OnboardOptions
 * @property {string} fillColor color of the modal background, defaults to {@link #.OnboardDefaultsFILL_COLOR|FILL_COLOR}
 * @property {number} fillOpacity opacity of the modal background, defaults to {@link #.OnboardDefaultsFILL_OPACITY|FILL_OPACITY}
 * @property {string} nextText default text for the Next button, defaults to {@link #.OnboardDefaultsNEXT_TEXT|NEXT_TEXT}
 * @property {string} windowClassName custom class name for popup window, defaults to {@link #.OnboardDefaultsWINDOW_CLASS_NAME|WINDOW_CLASS_NAME}
 * @property {number} animationDuration lenght of animation duration when transitioning between steps, defaults to {@link #.OnboardDefaultsANIMATION_DURATION|ANIMATION_DURATION}
 * @property {StepOptions[]} steps definition of steps
 */

/**
 * Options for the each Onboard step
 *
 * @typedef {Object} StepOptions
 * @property {string|HTMLElement} selector of spotlighted HTML/SVG node(s), if no selector is provided, no element is spotlighted and window is positioned in the center
 * @property {string} window title for this step, can be HTML
 * @property {string} body text for this step, can be HTML
 * @property {string} nextText text for the Next button, defaults to {@link #.OnboardDefaultsNEXT_TEXT|NEXT_TEXT} or OnboardOptions
 * @property {boolean} showProgress hides progress bar for this step if false 
 * @property {string} windowClass name allows to set additional window class name for this step, this can be used for customization
 * @property {number} windowWidth width of window for this step
 * @property {ShapeOptions} shape shape options
 */

/**
 * Shape otions for the each step
 *
 * @typedef {Object} ShapeOptions
 * @property {number} radius of the shape, can be customized if target element is rectangle but spotlight is required with rounded corners
 * @property {string} type can be set to change shape's type, supports 'rectangle' (default) and 'circle'. 
 * @property {number} width width of the shape if it requires to be different than target element's width
 * @property {number} height height of the shape if it requires to be different than target element's height
 * @property {number} strokeWidth can be set to extend spotlight by given number
 */

/**
 * Box definition
 * @typedef {Object} Box
 * @property {number} width
 * @property {number} height
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 */

/**
 * Position definition
 * @typedef {Object} Position
 * @property {number} top
 * @property {number} left
 * @property {string} position can be 'right-top', 'right-bottom', 'left-top', 'left-bottom'
 */

export default CleverOnboarding;
