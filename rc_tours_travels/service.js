document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");
  if (!form) return;
  const date = document.getElementById("serviceDate");
  const now = new Date();
  const today = [now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("-");
  date.min = today; date.value = today;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const service = form.dataset.service;
    const from = document.getElementById("serviceFrom")?.value.trim() || "";
    const to = document.getElementById("serviceTo").value.trim();
    const message = document.getElementById("serviceMessage");
    message.className = "form-status";
    if (service !== "hotel" && from.toLowerCase() === to.toLowerCase()) {
      message.textContent = "Departure and destination must be different.";
      message.classList.add("error"); return;
    }
    const params = new URLSearchParams({service,from,to,date:date.value,travellers:document.getElementById("serviceTravellers").value});
    location.href = `results.html?${params.toString()}`;
  });
});
