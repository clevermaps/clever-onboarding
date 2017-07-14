/**
 * Observable class, handles binding and firing events
 */
export default class Observable {
    /**
     * @param {string[]} events
     */
    constructor(events = []) {
        // create a map of handlers where each event has an array of bound handlers
        this._handlers = events.reduce((acc, cur)=>{
            acc[cur] = [];
            return acc;
        },{});
    }

	/**
	 * Binds event
	 * @param {string} event event name
	 * @param {Function} handler event handler
	 * @return {Observable}
	 */
    on(event, handler) {
        if (!(event in this._handlers)) throw "No such event: " + event;
		this._handlers[event].push(handler);
		return {
			destroy:()=>{
				this.off(event, handler)
			}
		};
    }

	/**
	 * Unbind event
	 * @param {string} event event name
	 * @param {Function} [handler] event handler, optional
	 * @return {Observable}
	 */
    off(event, handler) {
        if (!(event in this._handlers)) throw "No such event: " + event;
		if (!handler) {
			this._handlers[event] = [];
		} else {
			var handlers = this._handlers[event];
			var index = handlers.indexOf(handler);
			if (index != -1){
				handlers.splice(index, 1);
			}
		}
		return this;
    }

	/**
	 * Fire widget event
	 * @param {String} event event name
	 * @param {Array} args event arguments
	 * @return {Observable}
	 */
	fire(event, ...args) {
		if (!(event in this._handlers)) throw "No such event: " + event;
		var handlers = this._handlers[event];
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].apply(this, args);
		}
		return this;
    }

	/**
	 * Destorys this observable, removes events and so on 
	 * @return {Observable}
	 */
	destroy() {
		this._handlers = null;
		return this;
    }
	
}