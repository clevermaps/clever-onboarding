import * as BoxUtils from "./utils/BoxUtils";

/**
 * Handles window and arrow position based on target/window/arrow boxes
 */
export default class PositionResolver {
	/**
	 * Returns position of window based on target/window/arrow boxes
	 * @param {Box} targetBox
	 * @param {Box} windowBox
	 * @param {Box} arrowBox
	 * @returns {Position}
	 */
	getWindowPosition(targetBox, windowBox, arrowBox) {
		var position = this._getTargetPosition(targetBox, arrowBox);
		var left = this._getLeftWindowPosition(position, targetBox, arrowBox, windowBox);
		var top = this._getTopWindowPosition(position, targetBox, arrowBox, windowBox);

		return this._getConstrainedWindowPosition({
			position:position,
			left:left, 
			top:top
		}, windowBox);
	} 	

	/**
	 * Returns constrained window position to the browser viewport 
	 * @param {Position} position
	 * @param {Box} windowBox
	 * @returns {Position} constrained position
	 */
	_getConstrainedWindowPosition(position, windowBox){
		var viewportBox = BoxUtils.getBox(document.body);
		var offset = 5;
		var maxTop = viewportBox.bottom-windowBox.height-offset;
		var constrained = position.top > maxTop;

		return {
			...position,
			constrained:constrained,
			top:Math.min(maxTop, position.top)
		};
	}

	/**
	 * Returns position of arrow based on target/arrow boxes
	 * @param {Box} targetBox
	 * @param {Box} arrowBox
	 * @returns {Position}
	 */
	getArrowPosition(targetBox, arrowBox) {
		var position = this._getTargetPosition(targetBox, arrowBox);
		var left = this._getLeftArrowPosition(position, targetBox, arrowBox);
		var top = this._getTopArrowPosition(position, targetBox, arrowBox);

		return {
			position:position,
			left:left, 
			top:top
		}
	}	

	_getLeftWindowPosition(position, targetBox, arrowBox, windowBox){
		return {
			"left-top":targetBox.left + targetBox.width/2 + arrowBox.width,
			"right-top":targetBox.left - arrowBox.width - windowBox.width,
			"left-bottom":targetBox.left + targetBox.width/2 + arrowBox.width,
			"right-bottom":targetBox.left - windowBox.width - arrowBox.width,
		}[position];
	}

	_getTopWindowPosition(position, targetBox, arrowBox, windowBox){
		var verticalOffset = 25;
		// center arrow to the middle of target if target is smaller than 50px
		if (targetBox.height<50){
			verticalOffset = targetBox.height/2;
		}

		return {
			"left-top":targetBox.top + targetBox.height + arrowBox.height,
			"right-top":targetBox.top + verticalOffset + arrowBox.height,
			"left-bottom":targetBox.top - windowBox.height - arrowBox.height,
			"right-bottom":targetBox.top - windowBox.height - arrowBox.height + verticalOffset,
		}[position];
	}	

	_getLeftArrowPosition(position, targetBox, arrowBox){
		return {
			"left-top":targetBox.left + targetBox.width/2,
			"right-top":targetBox.left - arrowBox.width,
			"left-bottom":targetBox.left + targetBox.width/2 ,
			"right-bottom":targetBox.left - arrowBox.width,
		}[position];
	}

	_getTopArrowPosition(position, targetBox, arrowBox){
		var verticalOffset = 25;
		// center arrow to the middle of target if target is smaller than 50px
		if (targetBox.height<50){
			verticalOffset = targetBox.height/2
		}
		
		return {
			"left-top":targetBox.top + targetBox.height,
			"right-top":targetBox.top + verticalOffset,
			"left-bottom":targetBox.top - arrowBox.height,
			"right-bottom":targetBox.top - arrowBox.height + verticalOffset,
		}[position];
	}

	_getTargetPosition(targetBox){
		var point = [targetBox.left, targetBox.top];
		var crossPoint = [document.documentElement.clientWidth * 0.5,document.documentElement.clientHeight*0.5];
		var position = ["left", "top"];

		["right", "bottom"].forEach((s, i)=>{
			if (point[i]>crossPoint[i]){
				position[i] = s;
			}
		});

		return position.join("-");
	}
}