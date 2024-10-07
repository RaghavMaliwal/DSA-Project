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
  newEvent.classList.add("event");

  // Set event details
  newEvent.innerHTML = `
    <p class="eventName">${name}</p>
    <div class="schedule">
      <p class="startTime">${startTime}</p>
      <p>-</p>
      <p class="endTime">${endTime}</p>
    </div>
    <p class="venue">${venue}</p>
    <p class="desc">${desc}</p>
  `;

  // Add click event listener to the new event
  newEvent.addEventListener("click", () => {
    handleEventClick(newEvent);
  });

  // Append the new event to the container
  eventsContainer.appendChild(newEvent);
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
  isEditMode = false;
  updateViewMode();
}

// Handle adding a new event with default values
addEventBtn.addEventListener("click", () => {
  createEventElement(); // Add a new event with default values
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
  "Default Event",
  "00:00",
  "00:00",
  "Main Hall",
  "This is the default event."
);
