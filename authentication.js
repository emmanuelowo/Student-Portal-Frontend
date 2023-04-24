window.onload = function () {

    const token = localStorage.getItem('jwt');
    const currentRoute = window.location.pathname.split('/').pop();
  
  
    let authenticatedRoutes =
    [
        "my-question.html",
        "videos.html",
        "answer-question.html",
        "faqs.html"
  
    ];
  
  let unAuthenticatedRoutes =
    [
        "home.html",
        "login-signup.html",
  
    ];
  if (token) {
    // If the user is authenticated and on an unauthenticated route, redirect to the home page
    if (unAuthenticatedRoutes.includes(currentRoute)) {
        window.location.href = '/home.html';
    }
  } else {
    // If the user is not authenticated and on an authenticated route, redirect to the login page
    if (authenticatedRoutes.includes(currentRoute)) {
        window.location.href = '/login-signup.html';
    }
  }
  
};