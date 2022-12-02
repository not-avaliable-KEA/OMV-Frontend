'use strict'
import {Route, start} from "../router/router.js"
import { renderTemplate, loadHtml } from "../js/utils.js"

// import js methods from js pages
// login
import {init} from "../pages/login/login.js"

// user admin
import userInit from "../pages/user/users.js"

//TODO: work js - 
import coversInit from "../pages/work/create/work.js"
import workInit from "../pages/work/viewAll/viewWork.js"


// blog
import initBlog from "../pages/blog/viewAll/blog.js"
import initCreateBlog from "../pages/blog/create/createBlog.js"
import {homeInit} from "../pages/home/home.js"

// loading the pages
const templateHome  = await loadHtml("./pages/home/home.html");
const templateAbout = await loadHtml("./pages/about/about.html");
const templateLogin = await loadHtml("./pages/login/login.html");
const templateUsers = await loadHtml("./pages/user/users.html");
const templateWork = await loadHtml("./pages/work/viewAll/viewWork.html");
const templateCreateWork = await loadHtml("./pages/work/create/work.html");
const templateBlog  = await loadHtml("./pages/blog/viewAll/blog.html");
const templateCreateBlog = await loadHtml("./pages/blog/create/createBlog.html");

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
const ROUTE_CREATE_WORK = "/create-work"
const ROUTE_BLOG = "/blog"
const ROUTE_CREATE_BLOG = "/create-blog"
const ROUTE_EDIT_BLOG = "/blog/{id}/edit" // regex parameter

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

new Route(ROUTE_WORK, work);  

new Route(ROUTE_CREATE_WORK, createWork)
    .setPreFunction(pre)
    .setFailFunction(fail);
    
new Route(ROUTE_BLOG, blog);

new Route(ROUTE_CREATE_BLOG, createBlog)
    .setPreFunction(pre)
    .setFailFunction(fail);

new Route(ROUTE_EDIT_BLOG, editBlog)
    .setPreFunction(pre)
    .setFailFunction(fail);

  
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
    homeInit();
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

function blog() {
    renderTemplate(templateBlog);
    initBlog();
}

function createBlog() {
    renderTemplate(templateCreateBlog);
    initCreateBlog();
}

function editBlog(id) {
    renderTemplate(templateCreateBlog);
    initCreateBlog(id);
}
function work(){
    renderTemplate(templateWork);
    workInit();
}

function createWork(){
    renderTemplate(templateCreateWork);
    coversInit();
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