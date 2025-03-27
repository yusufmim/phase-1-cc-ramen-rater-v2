// index.js

// Callbacks
//const handleClick = (ramen) => {
  // Add code
//};

//const addSubmitListener = () => {
  // Add code
//}

//const displayRamens = () => {
  // Add code
//};

//const main = () => {
  // Invoke displayRamens here
  // Invoke addSubmitListener here
//}

//main()

// Export functions for testing
//export {
 // displayRamens,
 // addSubmitListener,
 // handleClick,
//  main,
//};




const baseURL = "http://localhost:3000/ramens";

// Fetch and display all ramen images in #ramen-menu
const displayRamens = async () => {
  const response = await fetch(baseURL);
  const ramens = await response.json();

  const ramenMenu = document.getElementById("ramen-menu");
  ramenMenu.innerHTML = ""; // Clear existing content

  ramens.forEach((ramen) => {
    const img = document.createElement("img");
    img.src = ramen.image;
    img.alt = ramen.name;
    img.addEventListener("click", () => handleClick(ramen));
    ramenMenu.appendChild(img);
  });

  // Display first ramen's details by default
  if (ramens.length > 0) handleClick(ramens[0]);
};

// Display selected ramen details
const handleClick = (ramen) => {
  document.querySelector(".detail-image").src = ramen.image;
  document.querySelector(".name").textContent = ramen.name;
  document.querySelector(".restaurant").textContent = ramen.restaurant;
  document.getElementById("rating-display").textContent = ramen.rating;
  document.getElementById("comment-display").textContent = ramen.comment;

  // Store the selected ramen ID for editing
  document.getElementById("edit-ramen").dataset.id = ramen.id;
};

// Add new ramen (not persistent)
const addSubmitListener = () => {
  document.getElementById("new-ramen").addEventListener("submit", (event) => {
    event.preventDefault();

    const newRamen = {
      name: document.getElementById("new-name").value,
      restaurant: document.getElementById("new-restaurant").value,
      image: document.getElementById("new-image").value,
      rating: document.getElementById("new-rating").value,
      comment: document.getElementById("new-comment").value,
    };

    const img = document.createElement("img");
    img.src = newRamen.image;
    img.alt = newRamen.name;
    img.addEventListener("click", () => handleClick(newRamen));
    document.getElementById("ramen-menu").appendChild(img);

    // Clear form fields
    event.target.reset();

    // Persist new ramen to database
    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRamen),
    });
  });
};

// Update ramen rating and comment
const updateRamen = () => {
  document.getElementById("edit-ramen").addEventListener("submit", (event) => {
    event.preventDefault();

    const ramenId = event.target.dataset.id;
    if (!ramenId) return;

    const updatedData = {
      rating: document.getElementById("new-rating").value,
      comment: document.getElementById("new-comment").value,
    };

    // Update frontend
    document.getElementById("rating-display").textContent = updatedData.rating;
    document.getElementById("comment-display").textContent = updatedData.comment;

    // Persist update to backend
    fetch(`${baseURL}/${ramenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  });
};

// Delete a ramen
const deleteRamen = () => {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.backgroundColor = "red";
  deleteBtn.style.color = "white";
  deleteBtn.style.marginTop = "10px";
  
  document.getElementById("ramen-detail").appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    const ramenId = document.getElementById("edit-ramen").dataset.id;
    if (!ramenId) return;

    fetch(`${baseURL}/${ramenId}`, { method: "DELETE" })
      .then(() => displayRamens()); // Refresh ramen list
  });
};

// Initialize the app
const main = () => {
  displayRamens();
  addSubmitListener();
  updateRamen();
  deleteRamen();
};

main();

// Export functions for testing
export { displayRamens, addSubmitListener, handleClick, updateRamen, deleteRamen, main };
