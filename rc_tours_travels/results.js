document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());
  const params = new URLSearchParams(location.search);
  const service = params.get("service") || "train";
  const from = params.get("from") || "";
  const to = params.get("to") || "your destination";
  const date = params.get("date") || "";
  const travellers = params.get("travellers") || "1";
  const names = {train:"Train",bus:"Bus",flight:"Flight",hotel:"Hotel"};
  document.getElementById("resultsTitle").textContent = `${names[service] || "Travel"} Options`;
  document.getElementById("routeSummary").textContent = service === "hotel"
    ? `Stays near ${to}${date ? ` · Check-in ${date}` : ""} · ${travellers} guest(s)/room(s)`
    : `${from} → ${to}${date ? ` · ${date}` : ""} · ${travellers} passenger(s)`;
  const base = {
    train:[["Intercity Express","Comfortable rail travel option",650],["Superfast Express","Long-distance travel option",980],["Premium AC Express","Premium class option",1650]],
    bus:[["AC Seater Coach","Daytime bus travel option",550],["Sleeper Coach","Overnight bus travel option",850],["Premium Volvo Coach","Premium coach option",1200]],
    flight:[["Economy Fare","Direct flight option",4200],["Flexible Economy","Flexible fare option",5900],["Premium Cabin","Premium fare option",9800]],
    hotel:[["City Comfort Hotel","Standard room option",2200],["Central Stay Suites","Deluxe room option",3800],["Grand Traveller Hotel","Premium room option",6200]]
  };
  let items = (base[service] || base.train).map((item,i) => ({name:item[0],desc:item[1],price:item[2],time:["Morning","Afternoon","Evening"][i]}));
  const list = document.getElementById("resultsCards");
  const sort = document.getElementById("sortResults");
  function render() {
    if (sort.value === "low") items.sort((a,b)=>a.price-b.price);
    else if (sort.value === "high") items.sort((a,b)=>b.price-a.price);
    else items.sort((a,b)=>a.time.localeCompare(b.time));
    list.replaceChildren();
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "result-card";
      const info = document.createElement("div");
      const h3 = document.createElement("h3"); h3.textContent = item.name;
      const p = document.createElement("p"); p.textContent = `${item.desc} · ${item.time}`;
      const badge = document.createElement("span"); badge.className = "listing-label"; badge.textContent = "EXAMPLE LISTING";
      info.append(h3,p,badge);
      const price = document.createElement("div"); price.className = "result-price";
      const strong = document.createElement("strong"); strong.textContent = `₹${item.price.toLocaleString("en-IN")}`;
      const button = document.createElement("button"); button.className = "result-button"; button.type = "button"; button.textContent = "Enquire";
      button.addEventListener("click", () => {
        const q = new URLSearchParams({service,from,to,date,option:item.name,price:String(item.price)});
        location.href = `contact.html?${q.toString()}`;
      });
      price.append(strong,button);
      card.append(info,price); list.append(card);
    });
    document.getElementById("resultCount").textContent = `(${items.length})`;
  }
  sort.addEventListener("change",render);
  render();
});
