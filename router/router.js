"use strict";

/**
 * Sets the head and tail of the regex for in the path.
 * As default the head and tail requires the an exact match on the url
 */
const REGEX_HEAD = "^";
const REGEX_TAIL = "\/?$";

const PARAM_PATTERN = /{[^\/]+}/g;
const PARAM_GET_PATTERN = "([^/\\s]+)";

/**
 * Defines a route, and the functions related to it
 */
export class Route {
  path;
  hasParams = false; // for router to know to use get params for mainFunction
  mainFunction;
  preFunction;
  failFunction;

  /**
   * Constructor for Route, takes a path as a string, and the function to be executed, when the path is hit
   */

  /**
   * 
   * @param {String} path Parameters can be added by adding "{}"(posibly with comment inside). It can also be done with RegEx, encapsulating it in "()", however don't escape "/"
   * @param {function} mainFunction Will be executed with the arguments, in order of appearence in the path
   * 
   */
  constructor(path, mainFunction) {
    // adding the escape character infront of "/" to not mess with RegEx
    path = path.replace("/", "\\/");
    
    // check if the path contains params
    if (PARAM_PATTERN.test(path)) {
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
   * This sets the default route function for the router
   * If no route is found for a given url, then this function is executed
   */
  static setDefaultFunction(f) {
    defaultFunction = f;
  }
}

/**
 * Store for the routes
 */
let routes = [];

/**
 * The default function is used when the url does not match a route
 */
let defaultFunction = "";

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
 * Routes the urls in the browser location bar.
 */
function router() {
  let url = window.location.hash.slice(1) || "/";

  try {
    let route = resolveRoute(url);

    let args = [];
    if(route.hasParams) {
      args = url.match(route.path).splice(1);
    }

    if (typeof route.preFunction === 'function') {
      if (Reflect.apply(route.preFunction, undefined, args)) {
        Reflect.apply(route.mainFunction, undefined, args)
      } else if (typeof route.failFunction === 'function') {
        Reflect.apply(route.failFunction, undefined, args)
      }
    } else {
      Reflect.apply(route.mainFunction, undefined, args)
    }
    
  } catch (e) {
    if (typeof defaultFunction === 'function') defaultFunction();
    console.log(e);
  }
}

/**
 * Start the router, should be called when everything has been loaded, 
 * to prevent starting the router before the resources has been set
 */
 export function start() {
  router();
  window.addEventListener("hashchange", router);
}