/* timestring to number */
function toNumber(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

class Node {
  constructor(name, start, end, color, eventElement) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.color = color; // RED or BLACK
    this.left = null;
    this.right = null;
    this.parent = null;
    this.data = eventElement; // Store reference to the DOM element
  }
}

class RedBlackTree {
  constructor() {
    this.TNULL = new Node(null, null, null, "BLACK", null); // Sentinel node for leaves
    this.root = this.TNULL;
  }

  // Rotate left at node x
  leftRotate(x) {
    let y = x.right;
    x.right = y.left;
    if (y.left !== this.TNULL) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  // Rotate right at node x
  rightRotate(x) {
    let y = x.left;
    x.left = y.right;
    if (y.right !== this.TNULL) {
      y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }

  // Balance the tree after insertion (same as in previous implementation)
  balanceInsert(node) {
    let current = node;
    while (current.parent && current.parent.color === "RED") {
      if (current.parent === current.parent.parent.left) {
        let uncle = current.parent.parent.right;
        if (uncle && uncle.color === "RED") {
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          if (current === current.parent.right) {
            current = current.parent;
            this.leftRotate(current);
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.rightRotate(current.parent.parent);
        }
      } else {
        let uncle = current.parent.parent.left;
        if (uncle && uncle.color === "RED") {
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          if (current === current.parent.left) {
            current = current.parent;
            this.rightRotate(current);
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.leftRotate(current.parent.parent);
        }
      }
    }
    this.root.color = "BLACK"; // The root must always be black
  }

  // Insert a node by event name
  insert(name, start, end, eventElement) {
    let newNode = new Node(name, start, end, "RED", eventElement); // Associate event element with node
    newNode.left = this.TNULL;
    newNode.right = this.TNULL;

    let parent = null;
    let current = this.root;

    while (current !== this.TNULL) {
      parent = current;
      if (toNumber(start) < toNumber(current.start)) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;
    if (parent === null) {
      this.root = newNode; // The tree was empty
    } else if (toNumber(start) < toNumber(parent.start)) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.balanceInsert(newNode); // Balance the tree
  }
  // Delete a node by event name
  deleteNode(start) {
    this.deleteNodeHelper(this.root, start);
  }

  deleteNodeHelper(node, start) {
    let z = this.TNULL;
    let x, y;

    // Find the node with the given start
    while (node !== this.TNULL) {
      if (toNumber(node.start) === toNumber(start)) {
        z = node;
      }

      if (toNumber(start) < toNumber(node.start)) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if (z === this.TNULL) {
      console.log("Node not found in the tree");
      return;
    }

    y = z;
    let yOriginalColor = y.color;
    if (z.left === this.TNULL) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === this.TNULL) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }

      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    if (yOriginalColor === "BLACK") {
      this.fixDelete(x);
    }
  }

  transplant(u, v) {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  minimum(node) {
    while (node.left !== this.TNULL) {
      node = node.left;
    }
    return node;
  }

  fixDelete(x) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.leftRotate(x.parent);
          w = x.parent.right;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.right.color === "BLACK") {
            w.left.color = "BLACK";
            w.color = "RED";
            this.rightRotate(w);
            w = x.parent.right;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.right.color = "BLACK";
          this.leftRotate(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.rightRotate(x.parent);
          w = x.parent.left;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.left.color === "BLACK") {
            w.right.color = "BLACK";
            w.color = "RED";
            this.leftRotate(w);
            w = x.parent.left;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.left.color = "BLACK";
          this.rightRotate(x.parent);
          x = this.root;
        }
      }
    }
    x.color = "BLACK";
  }

  // Search by event name
  search(start) {
    return this._search(this.root, start);
  }

  _search(node, start) {
    if (node === this.TNULL || toNumber(start) === toNumber(node.start)) {
      return node; // Found or reached a NIL node
    }

    if (toNumber(start) < toNumber(node.start)) {
      return this._search(node.left, start); // Search left subtree
    } else {
      return this._search(node.right, start); // Search right subtree
    }
  }

  // Modify a node's details based on event name
  modify(oldStart, newName, newStart, newEnd) {
    let node = this.search(oldStart);

    if (node === this.TNULL) {
      console.log("Node not found in the tree.");
      return;
    }

    // Check if the name has changed
    if (oldStart !== newStart) {
      // Store the old times
      let oldName = node.name;
      let oldEnd = node.end;

      // Delete the old node
      this.deleteNode(oldStart);

      // Insert a new node with updated details
      this.insert(newName, newStart, newEnd);
    } else {
      // Update only the start and end times if the name hasn't changed
      node.name = newName;
      node.end = newEnd;
    }

    console.log("Node modified successfully.");
  }

  // Print the tree (in-order traversal)
  inOrderHelper(node) {
    if (node !== this.TNULL) {
      this.inOrderHelper(node.left);
      console.log(node);
      if (node.right !== this.TNULL) {
        this.inOrderHelper(node.right);
      }
    }
  }

  // Public in-order traversal
  inOrderTraversal() {
    this.inOrderHelper(this.root);
  }
}

// Function to create a new event element

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

function createEventElement(name, startTime, endTime, venue, desc) {
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
    if (confirm("You want to delete the event?")) {
      // Get the event name from the DOM element to use as the identifier for deletion
      const startTime =
        deleteEvent.parentNode.querySelector(".startTime").innerHTML;

      // Delete the node from the Red-Black Tree
      eventTree.deleteNode(startTime);

      // Remove the event from the UI
      deleteEvent.parentNode.remove();

      // Optional: Verify the tree structure after deletion
      eventTree.inOrderTraversal();
    }
  });

  // Add click event listener to the new event to display event details
  newEvent.addEventListener("click", () => {
    handleEventClick(newEvent);
  });

  return mainEvent;
  // Append the mainEvent container to the events container
  //eventsContainer.appendChild(mainEvent);
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

// Function to display event details in the event displayer on click
function handleEventClick(eventElement) {
  if (!eventElement) {
    console.warn("Event element not found for display.");
    return;
  }

  currentEvent = eventElement;

  // Retrieve and display event details
  let eventName = eventElement.querySelector(".eventName")?.textContent;
  let startTime = eventElement.querySelector(".startTime")?.textContent;
  let endTime = eventElement.querySelector(".endTime")?.textContent;
  let venue = eventElement.querySelector(".venue")?.textContent || "Location";
  let desc = eventElement.querySelector(".desc")?.textContent || "Description";

  displayNameText.textContent = eventName;
  displayStartTimeText.textContent = startTime;
  displayEndTimeText.textContent = endTime;
  displayVenueText.textContent = venue;
  displayDescText.textContent = desc;

  // Make the event displayer visible with an animation
  eventDisplayer.style.visibility = "visible";
  eventDisplayer.style.animationName = "moveLeft";
  eventDisplayer.style.animationDuration = "0.3s";

  // Reset animation to allow retriggering if needed
  eventDisplayer.addEventListener(
    "animationend",
    () => {
      eventDisplayer.style.animationName = "";
    },
    { once: true }
  );

  // Switch to view mode if in edit mode
  isEditMode = false;
  updateViewMode();
}

let inputPopUp = document.querySelector(".inputPopUp");
let ClosepopUp = document.querySelector(".cancel");
let inputForm = document.querySelector("form");

// Event listener for the "Add Event" button
addEventBtn.addEventListener("click", () => {
  // Create and add a new event with default values
  inputForm.reset();
  inputPopUp.style.display = "flex";
});

ClosepopUp.addEventListener("click", () => {
  inputForm.reset();
  inputPopUp.style.display = "none";
});

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(inputForm);

  const en = data.get("event");
  const st = data.get("start");
  const et = data.get("end");
  const ve = data.get("venue");
  const de = data.get("description");

  console.log(en, st, et, ve, de);

  inputPopUp.style.display = "none";

  let newDiv = createEventElement(en, st, et, ve, de);
  let value = toNumber(newDiv.querySelector(".startTime").innerHTML);
  // Get the container and all existing divs within it
  //console.log(eventsContainer.childNodes.typeof());
  let divs = eventsContainer.childNodes;

  // Find the position to insert the new div in sorted order
  let inserted = false;
  for (let i = 0; i < divs.length; i++) {
    let divTime = toNumber(divs[i].querySelector(".startTime").innerHTML);
    if (value < divTime) {
      eventsContainer.insertBefore(newDiv, divs[i]);
      inserted = true;
      break;
    }
  }

  // If no larger element is found, append the new div at the end
  if (!inserted) {
    eventsContainer.appendChild(newDiv);
  }

  // Initialize the Red-Black Tree for events if it doesn't already exist
  if (!window.eventTree) {
    window.eventTree = new RedBlackTree();
  }

  const startNumeric = st;
  const endNumeric = et;

  // Insert the event into the Red-Black Tree
  window.eventTree.insert(en.toLowerCase(), startNumeric, endNumeric, newDiv);
  window.eventTree.inOrderTraversal();
  console.log("Event added:", en);
});

// Search functionality
function searchEvents() {
  let searchText = searchInput.value;
  console.log(typeof searchText);
  let resultNode = window.eventTree.search(searchText);

  // Hide all events initially
  if (searchText !== "") {
    let events = eventsContainer.getElementsByClassName("mainEvent");
    Array.from(events).forEach((event) => {
      event.style.display = "none";
    });
    if (
      resultNode &&
      resultNode !== window.eventTree.TNULL &&
      resultNode.data
    ) {
      // Ensure resultNode.data exists before trying to modify its style

      resultNode.data.style.display = "flex"; // `data` holds the event element
      console.log(resultNode); // Add this to see the result structure
    } else {
      console.log("Event not found");
      console.log(resultNode); // Add this to see the result structure
    }
  } else {
    let events = eventsContainer.getElementsByClassName("mainEvent");
    Array.from(events).forEach((event) => {
      event.style.display = "flex";
    });
  }
  // Show the event if found
}

// Event listener for search input
searchInput.addEventListener("input", searchEvents);

// Edit functionality for modifying event details
editBtn.addEventListener("click", () => {
  if (isEditMode) {
    // Retrieve the original start time before modification
    let originalStartTime = displayStartTimeText.textContent;
    let originalname = displayNameText.textContent;

    // Get new values from the edit input fields
    let newName = editNameInput.value;
    let newStartTime = editStartInput.value;
    let newEndTime = editEndInput.value;
    let newVenue = editVenueInput.value;
    let newDesc = editDescInput.value;

    // Ensure Red-Black Tree is initialized and update the tree with new values
    if (window.eventTree && currentEvent) {
      // Convert times to a numeric format if needed by the Red-Black Tree
      const newStartNumeric = toNumber(newStartTime);
      const newEndNumeric = toNumber(newEndTime);

      // Call a custom 'modify' method in the Red-Black Tree
      window.eventTree.modify(
        originalname,
        newName.toLowerCase(),
        newStartNumeric,
        newEndNumeric
      );

      // Update the display texts with new values
      displayNameText.textContent = newName;
      displayStartTimeText.textContent = newStartTime;
      displayEndTimeText.textContent = newEndTime;
      displayVenueText.textContent = newVenue;
      displayDescText.textContent = newDesc;

      // Update the event in the main container (home screen) if it exists
      currentEvent.querySelector(".eventName").textContent = newName;
      currentEvent.querySelector(".startTime").textContent = newStartTime;
      currentEvent.querySelector(".endTime").textContent = newEndTime;
      currentEvent.querySelector(".venue").textContent = newVenue;
      currentEvent.querySelector(".desc").textContent = newDesc;

      // Debug: Print the tree structure after modification
      console.log("Tree after modification:");
      window.eventTree.inOrderTraversal();
    } else {
      console.warn(
        "Event tree or current event not available for modification."
      );
    }
  }

  // Toggle edit mode and update the view
  isEditMode = !isEditMode;
  updateViewMode();
});

let sharebtn = document.getElementById("shareBtn");
let deleteIcons = document.querySelectorAll(".deleteEvent");

sharebtn.addEventListener("click", () => {
  var opt = {
    margin: 1,
    filename: "Schedule.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Hide all delete icons
  deleteIcons.forEach((icon) => (icon.style.display = "none"));

  // Delay to ensure icons are hidden before PDF generation
  setTimeout(() => {
    html2pdf()
      .from(eventsContainer)
      .set(opt)
      .save()
      .then(() => {
        // Re-show all delete icons after PDF generation
        deleteIcons.forEach((icon) => (icon.style.display = ""));
      });
  }, 2000); // Adjust the delay time if needed
});
