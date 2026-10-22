document.addEventListener("DOMContentLoaded", () => {
  const dateTime = document.getElementById("currentDateTime");
  function updateClock() {
    if (!dateTime) return;
    dateTime.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    }).format(new Date());
  }
  updateClock();
  if (dateTime) setInterval(updateClock, 30000);

  let fontSize = 100;
  const applyFontSize = () => document.documentElement.style.fontSize = `${fontSize}%`;
  document.getElementById("zoomIn")?.addEventListener("click", () => { fontSize = Math.min(150, fontSize + 10); applyFontSize(); });
  document.getElementById("zoomOut")?.addEventListener("click", () => { fontSize = Math.max(80, fontSize - 10); applyFontSize(); });
  document.getElementById("resetZoom")?.addEventListener("click", () => { fontSize = 100; applyFontSize(); });
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  const form = document.getElementById("bookingForm");
  if (!form) return;
  const tabs = [...document.querySelectorAll(".booking-tab")];
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const fromGroup = document.getElementById("fromGroup");
  const date = document.getElementById("JourneyDate");
  const dateLabel = document.getElementById("dateLabel");
  const returnDate = document.getElementById("returnDate");
  const returnGroup = document.getElementById("returnGroup");
  const travellersLabel = document.getElementById("travellersLabel");
  const searchService = document.getElementById("searchService");
  const message = document.getElementById("bookingMessage");
  let service = "train";
  const names = {train:"Trains", bus:"Buses", flight:"Flights", hotel:"Hotels"};
  const today = new Date();
  const localToday = [today.getFullYear(), String(today.getMonth()+1).padStart(2,"0"), String(today.getDate()).padStart(2,"0")].join("-");
  date.min = localToday;
  date.value = localToday;
  returnDate.min = localToday;
  date.addEventListener("change", () => {
    returnDate.min = date.value || localToday;
    if (returnDate.value && returnDate.value < returnDate.min) returnDate.value = "";
  });

  tabs.forEach(tab => tab.addEventListener("click", () => {
    service = tab.dataset.service;
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const hotel = service === "hotel";
    fromGroup.hidden = hotel;
    from.required = !hotel;
    to.required = true;
    document.getElementById("toLabel").textContent = hotel ? "Destination / City" : "To";
    dateLabel.textContent = hotel ? "Check-in Date" : "Journey Date";
    returnGroup.hidden = hotel;
    travellersLabel.textContent = hotel ? "Guests / Rooms" : service === "bus" ? "Passengers / Seats" : "Passengers";
    searchService.textContent = names[service];
    from.placeholder = service === "flight" ? "Departure airport / city" : "Departure city or station";
    to.placeholder = service === "flight" ? "Arrival airport / city" : "Destination city";
    message.textContent = "";
    message.className = "form-status";
  }));

  form.addEventListener("submit", event => {
    event.preventDefault();
    message.className = "form-status";
    const fromValue = from.value.trim();
    const toValue = to.value.trim();
    if (service !== "hotel" && fromValue.toLowerCase() === toValue.toLowerCase()) {
      message.textContent = "From aur To alag-alag enter karo.";
      message.classList.add("error");
      return;
    }
    if (date.value < localToday) {
      message.textContent = "Please choose today or a future date.";
      message.classList.add("error");
      return;
    }
    if (returnDate.value && returnDate.value < date.value) {
      message.textContent = "Return date must be on or after your journey date.";
      message.classList.add("error");
      return;
    }
    const params = new URLSearchParams({
      service, from: service === "hotel" ? "" : fromValue,
      to: toValue, date: date.value,
      returnDate: service === "hotel" ? "" : returnDate.value,
      travellers: document.getElementById("travellers").value
    });
    window.location.href = `results.html?${params.toString()}`;
  });
});
