const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});


// Function to handle sign in form submission
function handleSignIn(event) {
  event.preventDefault(); // Prevent the form from submitting the default way

  // Retrieve the values using getElementById
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Email:", email);
  console.log("Password:", password);


  // Add your API call or other logic here
  axios.post('http://localhost:3000/auth/login', {
    email: email,
    password: password
  })
    .then(function (response) {
      console.log(response.data);
      // Show the toast
      showToast('successToast');
          // Store the JWT in local storage
    localStorage.setItem('jwt', response.data.token);

    // Redirect to a new page after 2 seconds
    setTimeout(function () {
        // Redirect to the home page
        window.location.href = 'home.html';
      }, 2000);
    })
    .catch(function (error) {
      showToast('errorToast');

      console.log(error);
    });

  function showToast(value) {
    var toastEl = document.getElementById(value);
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }


}

// Function to handle sign up form submission
function handleSignUp(event) {
  event.preventDefault(); // Prevent the form from submitting the default way

  // Replace these selectors with the correct ones for your sign-up form
  const name = document.getElementById('name-sign-up').value;
  const email = document.getElementById('email-sign-up').value;
  const password = document.getElementById('password-sign-up').value;

  console.log("name:", name);

  console.log("Email:", email);
  console.log("Password:", password);

  // Add your API call or other logic here
  axios.post('http://localhost:3000/auth/register', {
    username: name,
    email: email,
    password: password
  })
    .then(function (response) {
      container.classList.remove("right-panel-active");
      showToast('successToast');
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Attach event listeners to the forms
document.querySelector('#signin-form').addEventListener('submit', handleSignIn);
document.querySelector('#signup-form').addEventListener('submit', handleSignUp);