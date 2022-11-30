'use strict'
import {Route, start} from "../router/router.js"
import { renderTemplate, loadHtml } from "../js/utils.js"

/**
 * Used to hold cached versions of used HTML templates.
 * Map object holds a key/value pair
 */
var htmlTemplateCache = new Map()


// import js methods from js pages
// login
import {init} from "../pages/login/login.js"

// user admin
import userInit from "../pages/user/users.js"

//TODO: work js - 
import coversInit from "../pages/work/work.js"

// loading the pages
const templateHome  = await loadHtml("./pages/home/home.html");
const templateAbout = await loadHtml("./pages/about/about.html");
const templateLogin = await loadHtml("./pages/login/login.html");
const templateUsers = await loadHtml("./pages/user/users.html");
const templateWork = await loadHtml("./pages/work/work.html");


/** 
 * Route constants.
 * 
 */
const ROUTE_HOME = '/'
const ROUTE_ABOUT = '/about'
const ROUTE_LOGIN = "/login"
const ROUTE_USERS = "/users"
const ROUTE_LOGOUT = "/logout"
const ROUTE_WORK = "/work"

/**
 * setting the default action
 * Route class: It is the piece of software in charge to organize
 *  the states of the application, switching between different views.
 * setDefaultFunktion; if theres no route, we execute pagenotfoundmethod. 
 */
Route.setDefaultFunction(pageNotFound);

/**
 * Creating the routes for the app
 * route parameter; takes path and function. 
 */
new Route(ROUTE_HOME, home)
   
new Route(ROUTE_ABOUT, about)

new Route(ROUTE_LOGIN, login)

new Route(ROUTE_LOGOUT, logout)

new Route(ROUTE_USERS, users)
    .setPreFunction(pre)
    .setFailFunction(fail);

new Route(ROUTE_WORK, work)

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

function logout() {
    sessionStorage.clear();
    window.location = "#/"
}

function users() {
    renderTemplate(templateUsers);
    userInit();
}

/**
 * Fail action.
 */
function fail() {
    window.location = "#/"
}

/**
 * Pre action.
 */
function pre() {

    if (sessionStorage.getItem("username") == "" 
        || sessionStorage.getItem("userId") <= 0) 
        return false;

    return true;
}

function work(){
    renderTemplate(templateWork);
    coversInit();
}

/**
 * Default action - this method that is called if the router is empty. 
 */
 function pageNotFound() {
    document.querySelector('#view').innerHTML = ('page-not-found-404'); 
}


/**
 * we call this method defined in router.js
 */
start();