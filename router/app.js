'use strict'
import Route from "../router/router.js"
import { renderTemplate, loadHtml } from "../js/utils.js"

/**
 * Used to hold cached versions of used HTML templates.
 */
var htmlTemplateCache = new Map()


// import js files for pages
// login
import {init} from "../pages/login/login.js"

// loading the pages
// Home
const templateHome = await loadHtml("./pages/home/home.html");
const templateAbout = await loadHtml("./pages/about/about.html");
const templateLogin = await loadHtml("./pages/login/login.html");
/** 
 * Route constants.
 */
const ROUTE_HOME = '/'
const ROUTE_ABOUT = '/about'
const ROUTE_LOGIN = "/login"

/**
 * setting the default action 
 */
Route.setDefaultFunction(pageNotFound);

/**
 * Creating the routes for the app
 */
new Route(ROUTE_HOME, home)
   
new Route(ROUTE_ABOUT, about)

new Route(ROUTE_LOGIN, login)


/**
 * Clones an embedded HTML template, from the HTML file, via an id.
 */
function cloneHtmlTemplate(id) {
    let div = document.createElement('div');
    const template = document.querySelector(`#${id}`);
    const clone = template.content.cloneNode(true);
    div.appendChild(clone)
    return div
}

/**
 * Home route action.
 */
function home() {
    //document.querySelector('#view').appendChild(cloneHtmlTemplate('template-frontpage')); 
    renderTemplate(templateHome);
}

/**
 * About route action.
 */
function about() {
    /*document.querySelector('#view').appentChild(cloneHtmlTemplate('template-about')); */
    renderTemplate(templateAbout);
}

function login() {
    renderTemplate(templateLogin);
    init();
}

/**
 * Fail action.
 */
function fail() {
    document.querySelector('#view').appentChild(cloneHtmlTemplate('template-ups'));
}

/**
 * Pre action.
 */
function pre() {
    console.log("hello, world! from preFunction");
    return Math.round(Math.random())
}

/**
 * Default action.
 */
 function pageNotFound() {
    document.querySelector('#view').appentChild('template-404'); 
}