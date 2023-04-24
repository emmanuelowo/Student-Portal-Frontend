// Select the logout button element
const logoutBtn = document.getElementById("log-out");

// Add a click event listener to the logout button
logoutBtn.addEventListener("click", function () {
  // Clear the JWT token from local storage
  localStorage.removeItem("jwt");

  // Redirect the user to the login/signup page
  window.location.href = '/home.html';
});

// When the window loads, execute the following function
window.onload = function () {
  const token = localStorage.getItem("jwt");
  const currentRoute = window.location.pathname.split('/').pop();

  // Define the authenticated routes
  let authenticatedRoutes = [
    "my-question.html",
    "videos.html",
    "answer-question.html",
    "faqs.html"
  ];

  // Define the unauthenticated routes
  let unAuthenticatedRoutes = [
    "home.html",
    "login-signup.html"
  ];

  // Check if the user is authenticated and handle route redirections
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

  // Fetch the questions
  fetchQuestions(token);
};

// Function to save changes in a question
function saveChanges() {
  const token = localStorage.getItem("jwt");
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  const config = {
    headers: { 'Authorization': 'Bearer ' + token }
  };

  const data = {
    title: title,
    description: description
  };

  // Send a POST request to the API to save the question
  axios.post("http://localhost:3000/qna/post-question", data, config)
    .then((response) => {
      fetchQuestions(token);
      const modalElement = document.getElementById('answerQuestionModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    })
    .catch((error) => {
      console.error(error);
      alert('Error while saving changes!');
    });
}


function fetchQuestions(token) {
  axios
    .get('http://localhost:3000/qna/get-my-questions', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const data = response.data;

      // Get the container
      const container = document.getElementById('question-container');

      // // Clear the container before adding new cards
      container.innerHTML = `    <div class="col-xs-12 col-sm-6 col-md-4 pd-b-10">
      <div class="add-question-placeholder">
          <button class="btn btn-outline-primary" data-bs-target="#answerQuestionModal"
              data-bs-toggle="modal">Add
              More
              <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
      </div>
  </div>`;

      // Loop through the questions and create a new card for each one
      data.data.questions.forEach((data) => {
        const card = document.createElement('div');
        card.className = 'col-xs-12 col-sm-6 col-md-4 pd-b-10';
        card.innerHTML = `
            <div class="question-card">
              <div class="qc-upper-part">
                <div class="qc-avatar">${data.creator.username.charAt(0).toUpperCase()}</div>
                <div>
                  <h6 class="mb-1">${data.title}</h6>
                  <p class="subtle-text mb-0">
                  ${new Date(data.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                  </p>
                </div>
              </div>
              <div class="qc-content-part">
                <p class="q-text">${data.description}</p>
                <button class="btn btn-outline-primary btn-sm answer-button"  data-bs-toggle="modal"
                data-bs-target="#answersModal">View Answers</button>
              </div>
            </div>
          `;

        // Add the new card to the container
        container.prepend(card);
        const answerButton = card.querySelector(".answer-button");
        answerButton.addEventListener("click", () => showAnswers(data.answers));

      });
    })
    .catch((error) => console.error(error));
}

function showAnswers(answers) {
  const answerContainer = document.getElementById("answer-container");
  answerContainer.innerHTML = "";
  if (answers.length === 0) {
    const noAnswerMessage = document.createElement("p");
    noAnswerMessage.textContent = "No answer yet";
    answerContainer.appendChild(noAnswerMessage);
  } else {
    answers.forEach((answer) => {
      const answerCard = document.createElement("div");
      answerCard.className = "answer-card";
      answerCard.innerHTML = `
      <div class="answer-avatar">${answer.creator.username.charAt(0).toUpperCase()}</div>
      <div class="answer-card-content">
        <div class="answer-card-upper">
          <h6 class="mb-1">${answer.creator.username}</h6>
          <p class="subtle-text mb-1">${new Date(answer.createdAt)}</p>
        </div>
        <div class="answer-card-desc">
          <p>${answer.text}</p>
        </div>
      </div>
    `;
      answerContainer.appendChild(answerCard);
    });
  }
}