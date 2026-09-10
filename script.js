const danceVideo = document.getElementById("danceVideo");
const scenes = ["lobby","boxOffice","ticketScene","corridor","theatre"];
let selectedSeat = null;
let ambienceOn = true;

const $ = id => document.getElementById(id);

function showScene(id){
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

$("enterCinema").onclick = () => showScene("boxOffice");

const seats = $("seats");
const taken = new Set(["A3","A7","B2","B6","C4","D1","D8"]);
["A","B","C","D"].forEach(row => {
  for(let n=1;n<=8;n++){
    const s = document.createElement("button");
    s.className = "seat" + (taken.has(row+n) ? " taken" : "");
    s.textContent = row+n;
    s.disabled = taken.has(row+n);
    s.onclick = () => {
      document.querySelectorAll(".seat.selected").forEach(x=>x.classList.remove("selected"));
      s.classList.add("selected");
      selectedSeat = row+n;
      $("buyTicket").disabled = false;
    };
    seats.appendChild(s);
  }
});

$("buyTicket").onclick = () => {
  if(!selectedSeat) return;
  $("ticketSeat").textContent = selectedSeat;
  showScene("ticketScene");
};

$("enterHall").onclick = () => {

    // Go to the corridor first
    showScene("corridor");

    setTimeout(() => {

        // Open cinema doors
        document.querySelector(".hall-door").classList.add("open");

        setTimeout(() => {

            // Enter the cinema
            showScene("theatre");

            const frame = document.querySelector(".screen-frame");

            // Open the cinema curtains
            setTimeout(() => {
                frame.classList.add("open");
            }, 350);

            // Start the dance video AFTER entering the cinema
            setTimeout(() => {

                danceVideo.currentTime = 0;

                danceVideo.play().catch(error => {
                    console.log("Video autoplay blocked:", error);
                });

                // Start audience cheering
                document.querySelector(".theatre").classList.add("cheering");

            }, 2500);

        }, 1800);

    }, 800);
};

$("openDrive").onclick = () => {
  window.open("https://drive.google.com/file/d/1Vf3ZZKTSfU3hCNkhIN6FDngIXhY2PoXb/view?usp=sharing", "_blank");
};

$("theatreFull").onclick = async () => {
  const theatre = document.querySelector(".theatre");
  if(document.fullscreenElement) await document.exitFullscreen();
  else await theatre.requestFullscreen?.();
};

$("soundToggle").onclick = () => {
  ambienceOn = !ambienceOn;
  $("soundToggle").innerHTML = `SOUND <b>${ambienceOn ? "ON" : "OFF"}</b>`;
};

// If Drive's embed refuses to render, show a graceful fallback.
setTimeout(() => {
  const iframe = $("drivePlayer");
  iframe.addEventListener("load", () => {
    // Drive may load its own player UI; keep it inside the projection screen.
  });
}, 0);
