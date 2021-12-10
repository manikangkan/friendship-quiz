// this is the leaderboard screen
const clientList = document.querySelector("#clientList");
console.log(clientCount);

for (let i = 0; i < clientCount; i++) {
  clientList.insertAdjacentHTML(
    "beforeend",
    generateClient(
      clients[i].clientName,
      clients[i].score,
      clients[i].max,
      300 + i * 100
    )
  );
}

function generateClient(name, score, max, delay) {
  const html = `
        <a href="${window.location.href}/${name}" class="btn btn-light w-100 wow fadeInUp mt-3 d-flex justify-content-between" "data-wow-delay="${delay}ms">
            <p>${name}</p>
            <p>${score} out of ${max}</p>
        </a>
    `;
  return html;
}
