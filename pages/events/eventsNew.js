const EVENT_INDEX_PATH = "/data/events/index.json";
const EVENT_IMG_PATH = "/data/images/bucket/";
const TRANS_TIME = 500; // in millis
const EL_IDS = {
  upcomingBtn: "upcoming-btn",
  pastBtn: "past-btn",
  upcomingEventsContainer: "upcoming-events",
  pastEventsContainer: "past-events",
  upcomingArrw: "upcoming-arrw",
  pastArrw: "past-arrw",
};

const eventStore = new Map();

function createEventCard(event) {
  const eventDiv = document.createElement("a");
  eventDiv.classList.add("event");
  eventDiv.href = event.link;

  // Convert the date and time to a more comfortable format
  const eventDate = new Date(event.date + "T" + event.time);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Remove leading zero from hours and format the time
  let formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // Remove leading zero from hours
  formattedTime = formattedTime.replace(/^0/, "");

  const img = document.createElement("img");
  img.src = EVENT_IMG_PATH + event.image;
  img.alt = "Event Image";
  eventDiv.appendChild(img);

  const h3 = document.createElement("h3");
  h3.textContent = formattedTime.toUpperCase() + " on " + formattedDate;
  eventDiv.appendChild(h3);

  const locationParagraph = document.createElement("p");
  const locationStrong = document.createElement("strong");
  locationStrong.textContent = "Location: ";
  locationParagraph.appendChild(locationStrong);
  locationParagraph.appendChild(document.createTextNode(event.location));
  eventDiv.appendChild(locationParagraph);

  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = event.description;
  eventDiv.appendChild(descriptionParagraph);

  return eventDiv;
}

function showUpcomingEvents(e) {
  e.preventDefault();

  const parent = e.target.parentElement;
  const eventContainer = eventStore.get(EL_IDS.upcomingEventsContainer);
  const button = eventStore.get(EL_IDS.upcomingBtn);
  const svg = eventStore.get(EL_IDS.upcomingArrw);

  button.disabled = true;
  svg.style.transform = "translateY(calc(4rem - 10px)) rotate(0deg)";

  if (parent.classList.contains("active")) {
    parent.classList.remove("active");
    eventContainer.classList.remove("active");
  } else {
    parent.classList.add("active");
    eventContainer.classList.add("active");
  }

  setTimeout(() => {
    button.disabled = false;
  }, TRANS_TIME);
}

function showPastEvents(e) {
  e.preventDefault();

  const parent = e.target.parentElement;
  const eventContainer = eventStore.get(EL_IDS.pastEventsContainer);
  const button = eventStore.get(EL_IDS.pastBtn);
  const svg = eventStore.get(EL_IDS.pastArrw);

  button.disabled = true;
  svg.style.transform = "translateY(calc(4rem - 10px)) rotate(0deg)";

  if (parent.classList.contains("active")) {
    parent.classList.remove("active");
    eventContainer.classList.remove("active");
  } else {
    parent.classList.add("active");
    eventContainer.classList.add("active");
  }

  setTimeout(() => {
    button.disabled = false;
  }, TRANS_TIME);
}

async function fetchAllEvents() {
  return fetch(EVENT_INDEX_PATH)
    .then((response) => response.json())
    .then((data) => {
      const upcomingEventsContainer = eventStore.get(
        EL_IDS.upcomingEventsContainer,
      );
      const pastEventsContainer = eventStore.get(EL_IDS.pastEventsContainer);

      const currentDate = new Date();

      // Filter and sort upcoming events ascending (soonest first)
      const upcomingEvents = data
        .filter(
          (event) => new Date(event.date + "T" + event.time) > currentDate,
        )
        .sort(
          (a, b) =>
            new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time),
        );

      // Filter and sort past events descending (most recent past first)
      const pastEvents = data
        .filter(
          (event) => new Date(event.date + "T" + event.time) <= currentDate,
        )
        .sort(
          (a, b) =>
            new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time),
        );

      for (const event of upcomingEvents) {
        const eventCard = createEventCard(event);
        upcomingEventsContainer.appendChild(eventCard);
      }
      for (const event of pastEvents) {
        const eventCard = createEventCard(event);
        pastEventsContainer.appendChild(eventCard);
      }
    });
}

/* ------------------------------------------------------------------------------------------------- */

for (const el in EL_IDS) {
  eventStore.set(EL_IDS[el], document.getElementById(EL_IDS[el]));
}

fetchAllEvents().then(() => {
  eventStore
    .get(EL_IDS.upcomingBtn)
    .addEventListener("click", showUpcomingEvents);
  eventStore.get(EL_IDS.pastBtn).addEventListener("click", showPastEvents);

  document.documentElement.style.setProperty("--trans-time", `${TRANS_TIME}ms`);
});
