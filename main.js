var main = {
	shortName: "main",
	name: "Main JS",
	enableDebugging: function(bool) {
		if (typeof bool == 'undefined' || bool) { // when parameter is omitted or true
			var bool = true;
		}

		sessionStorage.setItem('debug', bool);

		if (sessionStorage.getItem('debug') === "true" || sessionStorage.getItem('debug') === true) {
			window.debug = true;
		} else {
			window.debug = false;
		}
		return window.debug;
	},
	init: function() {
		// debugging
		if (sessionStorage.getItem('debug') === "true" || sessionStorage.getItem('debug') === true) {
			window.debug = true;
			console.info(this.shortName + " init is running, debug enabled");
		} else {
			window.debug = false;
			console.info("Enable Debugging by running: " + this.shortName + ".enableDebugging();");
		}

		/* general things and patches */
		document.querySelector('html').classList.remove("no-js");
		
		/* sets prototype and moves methods */
		this.createMethods(this.methods);
		delete this.methods;
		
	},
	createObj: function(parameterObj) {
		/* creates new object with prototype set to from where to function is called
		 * and merges properties and values from given parameter in Object from */
		if (typeof parameterObj !== "object") {
			if (debug) {console.error("createObj parameter %o is not an Object", parameterObj);}
			return false
		}
		var tempObj = Object.create(this);
		Object.keys(parameterObj).forEach(function(key) {
			tempObj[key] = parameterObj[key];
		});
		return tempObj;
	},
	createMethods: function(methods) {
		/* moves the methods outside of out of its object
		 * and sets prototype see function createObj for details */

		if (typeof methods !== "object") {
			throw new Error ("createMethods, paramter is not an object");
			return false;
		}

		for (var prop in methods) {
			// skip loop if the property is from prototype
			if (!methods.hasOwnProperty(prop)) { continue }
			
			if (typeof methods[prop] === "object") {
				this[prop] = this.createObj(methods[prop]); // get a new object	through createObj();
			} else {		
				this[prop] = methods[prop];	// just adopt the function or string etc.
			} 
			
			if (debug) {console.log("createMethods, ", prop, " > ", this[prop]);}
		}
	},
	methods: {
		/* these methods can be called from everywhere through prototype
		 * these methods will be moved outside of the methods object, which is going to removed */

		// for testing and understanding
		test: {
			init: function() {
				this.name = "testName";
				this.createMethods(this.subMethods); delete this.subMethods;
			},
			subMethods: {
				subObj: {
					init: function() {
						console.log("subClass log this.name:", this.name);
						console.log(
							"check4Existence #wrapper: ",
							this.check4Existence(document.getElementById("wrapper"))
						); 
					}
				}
			}

		},
		isElementInViewport: function (el) {
			// special bonus for those using jQuery
			if (typeof jQuery === "function" && el instanceof jQuery) {
				el = el[0];
			}
			var rect = el.getBoundingClientRect();

			/* old for fully in viewport */
			//return (
			//	rect.top >= 0 &&
			//	rect.left >= 0 &&
			//	rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			//	rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
			//);

			/* for partially in viewport, see:  http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport#comment-33214459 */
			return (
				rect.bottom >= 0 &&
				rect.right >= 0 &&
				rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.left <= (window.innerWidth || document.documentElement.clientWidth)
			);
		},
		check4Existence: function() {
			if (debug) { console.log("check4Existence %o", arguments);}
			var exists  = true;
			for (var i = arguments.length - 1; i >= 0; i--) {
				var current = arguments[i];
				if (typeof jQuery === "function" && current instanceof jQuery) { // is it a jQuery Object?
					if (!current.length) {			
						exists = false;
					}
				} else {
					if (!current) {
						exists = false;
					}
				}
				return exists;
			}
		}
	}
}



function ready(fn) {
  if (document.readyState != 'loading') {
	fn();
  } else {
	document.addEventListener('DOMContentLoaded', fn);
  }
}(main.init());





