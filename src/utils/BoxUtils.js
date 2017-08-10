	/**
     * @param {HTMLElement} element HTML element
	 * @returns {Object} box
     * @returns {number} box.width
     * @returns {number} box.height
     * @returns {number} box.top
     * @returns {number} box.left
     * @returns {number} box.right
     * @returns {number} box.bottom
	 */
	export const getBox = (element) => {
		if (!element) {
			return null;
		}

		var box = element.getBoundingClientRect();

		return {
			top:box.top + document.body.scrollTop,
			left:box.left + document.body.scrollLeft,
			right:box.left + document.body.scrollTop + box.width,
			bottom:box.top + document.body.scrollTop + box.height,
			width: box.width,
			height:box.height
		}
	}

	/**
	 * @param {Array<HTMLElement>} nodes array of HTML elements 
	 * @returns {Object} box
     * @returns {number} box.width
     * @returns {number} box.height
     * @returns {number} box.top
     * @returns {number} box.left
     * @returns {number} box.right
     * @returns {number} box.bottom
	 */
	export const getMultiBox = (nodes) => {
		var boxes = nodes.map(node=>getBox(node));

		var box = {
			top:Math.min.apply(Math, boxes.map(box=>box.top)),
			left:Math.min.apply(Math, boxes.map(box=>box.left)),
			right:Math.max.apply(Math, boxes.map(box=>box.right)),
			bottom:Math.max.apply(Math, boxes.map(box=>box.bottom))
		}

		box.width = box.right - box.left;
		box.height = box.bottom - box.top;

		return box; 
	}

	/**
     * @param {D3Selection} selection
	 * @returns {Object} box
     * @returns {number} box.width
     * @returns {number} box.height
     * @returns {number} box.top
     * @returns {number} box.left
     * @returns {number} box.right
     * @returns {number} box.bottom
	 */
	export const getTargetBox = (selection) => {
		var nodes = selection.nodes();

		if (nodes[0] && nodes[0].tagName == "path"){
			return getMultiBox(nodes);
		} else {
			return getBox(nodes[0]);
		}
	}