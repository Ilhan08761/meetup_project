document.addEventListener("DOMContentLoaded", () => {
  if (typeof eventsData === "undefined") {
    console.error("Массив событий eventsData не найден в js/data.js");
    return;
  }

  function createCardHtml(event) {
    const isOnline = !event.distance;
    const typeLabel = event.distance ? "Offline" : "Online";
    const distanceText = event.distance
      ? `(${event.distance})`
      : `(${typeLabel})`;

    const onlineBadgeHtml = isOnline
      ? `<div class="onlineBadge">
          <span class="onlineIcon">📹</span> 
          Online Event
         </div>`
      : "";

    return `
      <div class="eventCard" onclick="window.location.href='events.html'">
        <div class="eventImageContainer">
          <img src="${event.image}" alt="${event.title}" class="eventImage">
          ${onlineBadgeHtml}
        </div>
        <div class="eventInfo">
          <h3 class="eventTitle">${event.title}</h3>
          <div class="eventCategory">${event.category} ${distanceText}</div>
          <div class="eventDate">
            <span>📅</span> ${event.fullDate}
          </div>
          <div class="eventMeta">
            <div class="eventAttendees">
              <span>✔️</span> ${event.attendees} going
            </div>
            <div class="eventPrice">
              <span>🎟️</span> ${event.price}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const indexGrid = document.getElementById("indexEventsGrid");
  if (indexGrid) {
    indexGrid.innerHTML = eventsData
      .slice(0, 8)
      .map((event) => createCardHtml(event))
      .join("");
  }

  const filterGrid = document.getElementById("eventsGrid");
  if (filterGrid) {
    const filterType = document.getElementById("filterType");
    const filterDistance = document.getElementById("filterDistance");
    const filterCategory = document.getElementById("filterCategory");
    const filterDate = document.getElementById("filterDate");

    function filterEvents() {
      const typeVal = filterType.value;
      const distanceVal = filterDistance.value;
      const categoryVal = filterCategory.value;
      const dateVal = filterDate.value;

      const filtered = eventsData.filter((event) => {
        const isOffline = !!event.distance;

        const matchesType =
          typeVal === "all" ||
          (typeVal === "Offline" && isOffline) ||
          (typeVal === "Online" && !isOffline);

        const matchesDistance =
          distanceVal === "all" || event.distance === distanceVal;
        const matchesCategory =
          categoryVal === "all" || event.category === categoryVal;
        const matchesDate = dateVal === "all" || event.day === dateVal;

        return matchesType && matchesDistance && matchesCategory && matchesDate;
      });

      if (filtered.length === 0) {
        filterGrid.innerHTML =
          '<p class="noEventsMessage">No events found matching your criteria.</p>';
      } else {
        filterGrid.innerHTML = filtered
          .map((event) => createCardHtml(event))
          .join("");
      }
    }

    [filterType, filterDistance, filterCategory, filterDate].forEach(
      (select) => {
        if (select) select.addEventListener("change", filterEvents);
      },
    );

    filterEvents();
  }
});
