// convert the names to title case

function addName(divId, string) {
  document.querySelector(`#${divId}`).innerHTML += ` ${toSentenceCase(string)}`;
}

const toSentenceCase = function (str) {
  return str
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");
};

// funtion to convert first letter to uppercase
const toCapitalise = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
