var main = {
    shortName: "main",
    name: "Main JS",
    enableDebugging: function(bool) {
        if (typeof bool == 'undefined' || bool) { // when parameter is omitted or true
            var bool = true;
        }

        localStorage.setItem('debug', bool);

        if (localStorage.getItem('debug') === "true" || localStorage.getItem('debug') === true) {
            window.debug = true;
        } else {
            window.debug = false;
        }
        return window.debug;
    },
    init: function() {
        // debugging
        if (localStorage.getItem('debug') === "true" || localStorage.getItem('debug') === true) {
            window.debug = true;
            console.info(this.shortName + " init is running, debug enabled");
        } else {
            window.debug = false;
            console.info("Enable Debugging by running: "+ this.shortName +".enableDebugging();");
        }


        /* general things and patches */
        $('html').removeClass("no-js");
        $('img').removeAttr('height').removeAttr('width');
        svg4everybody();

        /* sets prototype and moves methods */
        this.createMethods(this.methods);
        delete this.methods;
        
    },
    createObj: function(parameterObj) {
        /* creates object with prototype set to from where to function is called
         * and merges properties and values from given parameter in Object from */

        var tempObj = Object.create(this);
        Object.keys(parameterObj).forEach(function(key) {
            tempObj[key] = parameterObj[key];
        });
        return tempObj;
    },
    createMethods: function(methods) {
        /* moves the methods outside of out of its object
         * and sets prototype see createObj for details */

        if (typeof methods != "object") {
            throw new Error ("createMethods, paramter is not an object");
            return false;
        }
        var obj = methods;
        for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) { continue }
            this[prop] = this.createObj(methods[prop]);
            if (debug) {console.log("createMethods, ",prop," > ", this[prop]);}
        }
    },
    methods: {
        /* these methods can be called from everywhere through prototype
         * these methods will be moved outside of the methods object, which is going to removed */

       // for testing and understanding
       /* test: {
            init: function() {
                this.name = "testName";
                this.createMethods(this.subMethods); delete this.subMethods;
            },
            subMethods: {
                subObj: {
                    init: function() {
                        console.log("subClass logsName:",this.name);
                    }
                }
            }

        },*/
        isElementInViewport: function (el) {
            //special bonus for those using jQuery
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
            var rect = el.getBoundingClientRect();

            /* old for fully in viewport */
            //return (
            //    rect.top >= 0 &&
            //    rect.left >= 0 &&
            //    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            //    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            //);

            /* for partially in viewport, see:  http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport#comment-33214459 */
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        check4Existance: function() {
            if (debug) { console.log("check4Existance %o",arguments);}
            var exists  = true;
            for (var i = arguments.length-1; i >= 0; i--) {
                var current = arguments[i];
                if (!current) {
                    exists = false;
                }
                return exists;
            }
        }
    }
}

