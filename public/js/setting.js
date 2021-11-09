const floating_btn_gear = document.querySelector(".floating-btn-wrapper img");
const menu = document.querySelector(".menu");
floating_btn_gear.addEventListener("click", () => {
  menu.classList.toggle("open");
  floating_btn_gear.classList.toggle("selected-question");
});
