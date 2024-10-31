// Elements
let eventsContainer = document.getElementById("eventsContainer");
let eventDisplayer = document.querySelector(".eventDisplayer");
let addEventBtn = document.getElementById("addEventBtn");
let closeButton = document.querySelector(".closeButton");

// Display elements for the event displayer
let displayNameText = document.getElementById("displayNameText");
let displayStartTimeText = document.getElementById("stDetailText");
let displayEndTimeText = document.getElementById("etDetailText");
let displayVenueText = document.getElementById("vDetailText");
let displayDescText = document.getElementById("descText");

// Input elements for editing
let editNameInput = document.getElementById("editNameInput");
let editStartInput = document.getElementById("editStartInput");
let editEndInput = document.getElementById("editEndInput");
let editVenueInput = document.getElementById("editVenueInput");
let editDescInput = document.getElementById("editDescInput");

// Toggle button
let editBtn = document.getElementById("editBtn");

let isEditMode = false;
let currentEvent = null; // Stores the current event being edited

// Function to create a new event element
function createEventElement(
  name = "Event Name",
  startTime = "00:00",
  endTime = "00:00",
  venue = "Venue",
  desc = "Description"
) {
  let newEvent = document.createElement("div");
  let mainEvent = document.createElement("div");
  let deleteEvent = document.createElement("div");
  deleteEvent.classList.add("deleteEvent");
  mainEvent.classList.add("mainEvent");
  newEvent.classList.add("event");

  mainEvent.appendChild(newEvent);
  mainEvent.appendChild(deleteEvent);

  // Set event details
  newEvent.innerHTML = `
    <p class="eventName">${name}</p>
    <div class="schedule">
      <p class="startTime">${startTime}</p>
      <p>-</p>
      <p class="endTime"> ${endTime}</p>
    </div>
    <p class="venue">${venue}</p>
    <p class="desc">${desc}</p>
    `;

  deleteEvent.innerHTML = `
  <svg id="delete" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 16">
    <defs>
        <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/>
    </defs>
    <use fill="#e90404" fill-rule="nonzero" xlink:href="#a"/>
  </svg>
  `;

  deleteEvent.addEventListener("click", () => {
    deleteEvent.parentNode.remove();
  });

  // Add click event listener to the new event
  newEvent.addEventListener("click", () => {
    handleEventClick(newEvent);
  });

  // Append the new event to the container
  eventsContainer.appendChild(mainEvent);
}

// Close button functionality
closeButton.addEventListener("click", () => {
  eventDisplayer.style.visibility = "hidden";
  isEditMode = false;
  updateViewMode();
});

// Function to switch between view and edit mode
function updateViewMode() {
  if (isEditMode) {
    // Show input fields for editing
    displayNameText.style.display = "none";
    editNameInput.style.display = "inline";
    editNameInput.value = displayNameText.textContent;

    displayStartTimeText.style.display = "none";
    editStartInput.style.display = "inline";
    editStartInput.value = displayStartTimeText.textContent;

    displayEndTimeText.style.display = "none";
    editEndInput.style.display = "inline";
    editEndInput.value = displayEndTimeText.textContent;

    displayVenueText.style.display = "none";
    editVenueInput.style.display = "inline";
    editVenueInput.value = displayVenueText.textContent;

    displayDescText.style.display = "none";
    editDescInput.style.display = "block";
    editDescInput.value = displayDescText.textContent;

    editBtn.textContent = "Save Details";
  } else {
    // View mode
    displayNameText.style.display = "inline";
    editNameInput.style.display = "none";

    displayStartTimeText.style.display = "inline";
    editStartInput.style.display = "none";

    displayEndTimeText.style.display = "inline";
    editEndInput.style.display = "none";

    displayVenueText.style.display = "inline";
    editVenueInput.style.display = "none";

    displayDescText.style.display = "block";
    editDescInput.style.display = "none";

    editBtn.textContent = "Edit Details";
  }
}

// Function to update event details in both the home screen and event displayer
function handleEventClick(eventElement) {
  currentEvent = eventElement;

  let eventName = eventElement.querySelector(".eventName").textContent;
  let startTime = eventElement.querySelector(".startTime").textContent;
  let endTime = eventElement.querySelector(".endTime").textContent;
  let venue = eventElement.querySelector(".venue").textContent;
  let desc = eventElement.querySelector(".desc").textContent;

  // Update the event displayer with clicked event details
  displayNameText.textContent = eventName;
  displayStartTimeText.textContent = startTime;
  displayEndTimeText.textContent = endTime;
  displayVenueText.textContent = venue;
  displayDescText.textContent = desc;

  // Make the event displayer visible
  eventDisplayer.style.visibility = "visible";
  eventDisplayer.style.animationName = "moveLeft";
  eventDisplayer.style.animationDuration = "0.3s";

  isEditMode = false;
  updateViewMode();
}

// Handle adding a new event with default values
addEventBtn.addEventListener("click", () => {
  createEventElement(); // Add a new event with default values

// Element for search input
let searchInput = document.getElementById("searchInput");

// Function to search events based on user input
function searchEvents() {
  let searchText = searchInput.value.toLowerCase();
  let events = eventsContainer.getElementsByClassName("event");

  // Loop through each event and display or hide based on search text match
  Array.from(events).forEach(event => {
    let eventName = event.querySelector(".eventName").textContent.toLowerCase();
    let venue = event.querySelector(".venue").textContent.toLowerCase();
    let desc = event.querySelector(".desc").textContent.toLowerCase();

    if (
      eventName.includes(searchText) ||
      venue.includes(searchText) ||
      desc.includes(searchText)
    ) {
      event.parentElement.style.display = ""; // Show event if it matches
    } else {
      event.parentElement.style.display = "none"; // Hide event if it doesn’t match
    }
  });
}

// Add search event listener
searchInput.addEventListener("input", searchEvents);


});

// Edit functionality
editBtn.addEventListener("click", () => {
  if (isEditMode) {
    // Save the changes
    displayNameText.textContent = editNameInput.value;
    displayStartTimeText.textContent = editStartInput.value;
    displayEndTimeText.textContent = editEndInput.value;
    displayVenueText.textContent = editVenueInput.value;
    displayDescText.textContent = editDescInput.value;

    // Update the event in the main container (home screen)
    currentEvent.querySelector(".eventName").textContent =
      displayNameText.textContent;
    currentEvent.querySelector(".startTime").textContent =
      displayStartTimeText.textContent;
    currentEvent.querySelector(".endTime").textContent =
      displayEndTimeText.textContent;
    currentEvent.querySelector(".venue").textContent =
      displayVenueText.textContent;
    currentEvent.querySelector(".desc").textContent =
      displayDescText.textContent;
  }

  // Toggle the mode
  isEditMode = !isEditMode;
  updateViewMode();
});

// Initialize with a default event when the page loads
createEventElement(
  "Event Name",
  "00:00",
  "00:00",
  "Loacation",
  "Event Description"
);
