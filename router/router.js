/**
 * Store for the routes
 */
 let routes = [];

 /**
  * The default function is used when the url does not match a route
  */
 let defaultFunction = "";
 
 export default class Router {
   /**
    * Makes a new router, and it is added to the posible routes, in the router.
    * Takes a path as a string, and the function to be executed, when the path is hit
    *
    * @param {String} path Parameters can be added by adding "{}"(posibly with comment inside). It can also be done with RegEx, encapsulating it in "()", however don't escape "/"
    * @param {function} mainFunction Will be executed with the arguments, in order of appearence in the path
    * @returns
    */
   static addRoute(path, mainFunction) {
     return new Route(path, mainFunction);
   }
 
   /**
    * Start the router, should be called when everything has been loaded,
    * to prevent starting the router before the resources has been set
    */
   static start() {
     router();
     window.addEventListener("hashchange", router);
   }
 
   /**
    * This sets the default route function for the router
    * If no route is found for a given url, then this function is executed
    */
   static setDefaultFunction(f) {
     defaultFunction = f;
   }
 }
 
 let exitFunction;
 let url;
 
 /**
  * Routes the urls in the browser location bar.
  */
 function router() {
   // exit function
   if (typeof exitFunction === "function") { // checks for the exit function
     if (!exitFunction()) {                  // if the exitFunction returns false
       window.location.hash = url;           // set the url to the old url, and return out of router
       return;
     }
   }
 
   url = window.location.hash.slice(1) || "/";
 
   try {
     let route = resolveRoute(url);
 
     let args = [];
     if (route.hasParams) {
       args = url.match(route.path).splice(1);
     }
 
     if (typeof route.preFunction === "function") {
       if (Reflect.apply(route.preFunction, undefined, args)) {
         Reflect.apply(route.mainFunction, undefined, args);
       } else if (typeof route.failFunction === "function") {
         Reflect.apply(route.failFunction, undefined, args);
       }
     } else {
       Reflect.apply(route.mainFunction, undefined, args);
     }
 
     exitFunction = route.exitFunction;
   } catch (e) {
     if (typeof defaultFunction === "function") defaultFunction();
     console.log(e);
   }
 }
 
 /**
  * Gets a route.
  */
 function resolveRoute(path) {
   for (const route of routes) {
     if (route.path.test(path)) {
       return route;
     }
   }
   throw new Error(`Route ${path} not found`);
 }
 
 /**
  * Sets the head and tail of the regex for in the path.
  * As default the head and tail requires an exact match on the url
  */
 const REGEX_HEAD = "^";
 const REGEX_TAIL = "/?$";
 
 const PARAM_PATTERN = /{[^\/]*}/g;         // Pattern for testing for the standard param pattern ie. "{}"
 const PARAM_GET_PATTERN = "([^/\\\s]+)";   // Pattern to be inserted into route, in place of the standard param pattern
 const USER_PARAM_PATTERN = /\([^\/]+\)/g;  // If the user inputs a regex expression, with a group, used to check if the there are params that needs to added to the run of the functions in the route
 
 /**
  * Defines a route, and the functions related to it
  */
 class Route {
   path;
   hasParams = false; // for router to know to use get params for mainFunction
   mainFunction;
   preFunction;
   failFunction;
   exitFunction;
 
   /**
    * Constructor for Route, takes a path as a string, and the function to be executed, when the path is hit
    *
    * @param {String} path Parameters can be added by adding "{}"(posibly with comment inside). It can also be done with RegEx, encapsulating it in "()", however don't escape "/"
    * @param {function} mainFunction Will be executed with the arguments, in order of appearence in the path
    *
    */
   constructor(path, mainFunction) {
     // adding the escape character infront of "/" to not mess with RegEx
     path = path.replace("/", "\\/");
 
     // check if the path contains params
     if (PARAM_PATTERN.test(path) || USER_PARAM_PATTERN.test(path)) {
       this.hasParams = true;
 
       // replace params with the pattern to get the params in regex
       path = path.replace(PARAM_PATTERN, PARAM_GET_PATTERN);
     }
 
     // "^" and "$" are added to make exact match on string, and the "\/?" is to ignore trailing "/"
     this.path = new RegExp(REGEX_HEAD + path + REGEX_TAIL);
     this.mainFunction = mainFunction;
 
     routes.push(this);
   }
 
   /**
    * Set the function to be called before the mainFunction of a route.
    * The function should return either true or false,
    * ff the function returns false, the fail function will be called, if set.
    * @param {function} preFunction
    */
   setPreFunction(preFunction) {
     this.preFunction = preFunction;
     return this;
   }
 
   /**
    * set the function to be called if the preFunction of a route returns false
    * @param {function} failFunction
    */
   setFailFunction(failFunction) {
     this.failFunction = failFunction;
     return this;
   }
 
   /**
    * Sets a function to be called before the new route is loaded
    *
    * @param {Function} exitFunction The function should return true or false, if the router 
    * should allow the redirect and fire the next route
    * @returns {Route}
    */
   setExitFunction(exitFunction) {
     this.exitFunction = exitFunction;
     return this;
   }
 }
 