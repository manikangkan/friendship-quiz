const clientLoginBtn = document.querySelector("#clientLogin");

clientLoginBtn.addEventListener("click", function () {
  let usercode = document.querySelector("#usercode").value;
  if (usercode == null || usercode == "") {
    modalTrigger(
      "Hello there!",
      "How can you imagine to play quiz without a code, Let's type a code below yaaay!",
      "Let's go"
    );
    return;
  }

  if (validURL(usercode)) {
    // usercode = usercode.split("/")[usercode.split("/").length - 3];
    console.log("this is a url " + usercode);
  }
  if (hasLowerCase(usercode)) {
    validate(usercode).then((data) => {
      if (data.userExists) window.location.href = data.redirect;
      else {
        modalTrigger(
          "Hello there!",
          "You know, this code actually doesn't exist, Let's try again!",
          "Ok"
        );
      }
    });
  } else {
    modalTrigger(
      "Hello there!",
      "That's seems a invalid code, can you reenter a correct code",
      "Yes I do"
    );
  }
});

function hasLowerCase(str) {
  return /^[a-zA-Z]+$/.test(str);
}

async function validate(usercode) {
  const response = await fetch(`/${usercode.toLowerCase()}/validate`, {
    method: "GET",
    redirect: "follow",
  });
  return response.json();
}

function validURL(str) {
  var res = str.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

function liveValidate(code) {
  if (code != null && code != "") {
    validate(code).then((data) => {
      if (data.userExists) {
        $("#clientLogin").addClass("btn-primary");
        $("#clientLogin").removeClass("btn-border");
        $("#clientLogin").text("let's play");
      } else {
        $("#clientLogin").removeClass("btn-primary");
        $("#clientLogin").addClass("btn-border");
        $("#clientLogin").text("play");
      }
    });
  }
}
