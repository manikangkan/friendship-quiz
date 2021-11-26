let questions = [];
let answers = [];
let n = 0; // no of questions visible on this screen
let hard_ques_limit = 3; //user should cook/activate atleast this much questions

const qBoard = document.querySelector("#qBoard");

const loadSampleQuestions = async () => {
  await fetch("/js/quesPreset.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("loaded");
      questions = data.questions;
      answers = data.answers;
      n = data.limit;
      return data;
    })
    .catch((err) => console.log(err));
};

loadSampleQuestions().then((data) => {
  for (let index = 0; index < n; index++) {
    qBoard.insertAdjacentHTML("beforeend", qHTML(index));
    optionMechanism(index);
  }
});

const qHTML = (index) => `
    <div id="q${index}" class="border-top my-5 wow fadeInUp" data-wow-delay="300ms">
            <div class="
                  d-flex
                  justify-content-center
                  align-items-center
                  responder-question-number                  
                ">
                <p id="activeStatus" type="button" class="border d-flex justify-content-center align-items-center">
                ${index + 1}
                </p>
                </div>
                <div class="row g-3 py-5">
                <div class="col-12">
                <input type="text" id="qString" class="form-control" value="${
                  questions[index]
                }">
          </div>
          <div class="col-sm-12 col-md-6">
                <input type="text" id="option_a" class="opn btn btn-light w-100" value="${
                  answers[index][0]
                }">
            </div>
            <div class="col-sm-12 col-md-6">
                <input type="text" id="option_b" class="opn btn btn-light w-100" value="${
                  answers[index][1]
                }">
            </div>
            <div class="col-sm-12 col-md-6">
                <input type="text" id="option_c" class="opn btn btn-light w-100" value="${
                  answers[index][2]
                }">
            </div>
            <div class="col-sm-12 col-md-6">
                <input type="text" id="option_d" class="opn btn btn-light w-100" value="${
                  answers[index][3]
                }">
            </div>
            </div>
          </div>
        
`;

function optionMechanism(index) {
  const qActivateBtn = document.querySelector(
    `#qBoard #q${index} #activeStatus`
  );
  qActivateBtn.addEventListener("click", () => {
    qActivateBtn.classList.toggle("btn-primary");
    qActivateBtn.parentElement.parentElement.classList.toggle(
      "highlight-selected-question-background"
    );
    console.log(qActivateBtn.parentElement.parentElement);
  });

  const options = document.querySelectorAll(`#qBoard #q${index} .opn`);
  // console.log(options);

  const buttonA = options[0];
  const buttonB = options[1];
  const buttonC = options[2];
  const buttonD = options[3];

  // future implementation FEATURE will show blank value on button focus and show optionA/b/c/d on leave focus

  buttonA.addEventListener("click", function (e) {
    e.stopPropagation();
    buttonA.classList.add("btn-primary");
    buttonB.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");
  });

  buttonB.addEventListener("click", function (e) {
    e.stopPropagation();
    buttonB.classList.add("btn-primary");
    buttonA.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");
  });

  buttonC.addEventListener("click", function (e) {
    e.stopPropagation();
    buttonC.classList.add("btn-primary");
    buttonA.classList.remove("btn-primary");
    buttonB.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");
  });

  buttonD.addEventListener("click", function (e) {
    e.stopPropagation();
    buttonD.classList.add("btn-primary");
    buttonA.classList.remove("btn-primary");
    buttonB.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
  });
}

const cookBtn = document.querySelector("#cook");
cookBtn.addEventListener("click", () => {
  cook();
});

function cook() {
  const allCookedQuesitons = [];
  for (let index = 0; index < n; index++) {
    const qSection = qBoard.querySelector(`#q${index}`);
    if (
      !qSection.querySelector("#activeStatus").classList.contains("btn-primary")
    )
      continue;

    console.log(qSection);
    if (qSection.querySelector(".opn.btn-primary") == null) {
      alert(`option on Question ${index + 1} not selected`);
      return;
    }

    var qsObj = {
      question: qSection.querySelector("#qString").value,
      option_a: qSection.querySelector("#option_a").value,
      option_b: qSection.querySelector("#option_b").value,
      option_c: qSection.querySelector("#option_c").value,
      option_d: qSection.querySelector("#option_d").value,
      correctAns: qSection.querySelector(".btn-primary").id,
    };

    allCookedQuesitons.push(qsObj);
  }

  if (allCookedQuesitons.length < hard_ques_limit) {
    alert("please select minimum " + hard_ques_limit + " questions");
    return;
  }

  const jsonBody = {
    username,
    cookedQs: allCookedQuesitons,
    gender: gender,
    date,
  };

  postData(`/cooked`, jsonBody).then((data) => {
    console.log(data.message);
    window.location.href = data.redirect;
  });
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
