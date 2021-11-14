const avatars = document.querySelectorAll(".rounded-circle");

// random avatar generation
avatars.forEach(
  (avatar, index) =>
    (avatar.src = `https://avatars.dicebear.com/api/micah/${
      Math.random() * (index + 1)
    }.svg?background=%23f4d150`)
);

//fade up animation using wow.js
const items = document.querySelectorAll(".mani-kangkan");
items.forEach((item, index) => {
  item.classList.add("wow", "fadeInDown");
  item.setAttribute("data-wow-delay", (index + 1) * 200 + "ms");
  item.classList.remove("mani-kangkan");
});

// const btn = document.querySelectorAll(".btn");
// console.log(btn);
// var seed;
// btn.forEach((item) => {
//   item.addEventListener("click", () => {
//     var seed = Math.floor(Math.random() * 5000);
//     console.log(seed);
//     avatar.src = `https://avatars.dicebear.com/api/micah/${seed}.svg?background=%23f4d150`;
//   });
// });
