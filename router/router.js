"use strict";

/**
 * Defines a route, and the functions related to it
 */
export class Route {
  path;
  mainFunction;
  preFunction;
  failFunction;

  /**
   * Constructor for Route, takes a path as a string, and the function to be executed, when the path is hit
   */
  constructor(path, mainFunction) {
    this.path = path;
    this.mainFunction = mainFunction;

    routes[path] = this;
  }

  /**
   * set the function to be called before the mainFunction of a route
   */
  setPreFunction(preFunction) {
    this.preFunction = preFunction;
    return this;
  }

  /**
   * set the function to be called if the preFunction of a route returns false
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
let routes = {};

/**
 * The default function is used when the url does not match a route
 */
let defaultFunction = "";

/**
 * Gets a route.
 */
function resolveRoute(route) {
  try {
    return routes[route];
  } catch (e) {
    return new Error(`Route ${route} not found`);
  }
}

/**
 * Routes the urls in the browser location bar.
 */
function router(evt) {
  let url = window.location.hash.slice(1) || "/";

  try {
    let route = resolveRoute(url);


    if (typeof route.preFunction === 'function') {
      if (route.preFunction()) {
        route.mainFunction();
      } else if (typeof route.failFunction === 'function') {
        route.failFunction();
      }
    } else {
      route.mainFunction();
    }

    
  } catch (e) {
    if (typeof defaultFunction === 'function') defaultFunction();
    console.log(e);
  }
}

/**
 * Window event hooks.
 */
export function start() {
  router();
  window.addEventListener("hashchange", router);
}
