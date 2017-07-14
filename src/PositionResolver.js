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

		return {
			position:position,
			left:left, 
			top:top
		}
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
		return {
			"left-top":targetBox.top + targetBox.height + arrowBox.height,
			"right-top":targetBox.top + targetBox.height/2 + arrowBox.height,
			"left-bottom":targetBox.top - windowBox.height - arrowBox.height,
			"right-bottom":targetBox.top - windowBox.height + arrowBox.height,
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
		return {
			"left-top":targetBox.top + targetBox.height,
			"right-top":targetBox.top + targetBox.height/2,
			"left-bottom":targetBox.top - arrowBox.height,
			"right-bottom":targetBox.top + arrowBox.height,
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