const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-FTB-ET-WEB-FT/events";
const form = document.querySelector("form");

const state = {
  parties: [],
};

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.parties = json.data;
    renderEvents();
  } catch (err) {
    console.error("Fetching Error", err);
  }
}

/** Asks the API to create a new artist based on the given `artist` */
async function addEvents(party) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (err) {
    console.error("Error adding events:", err);
  }
  await getParties();
}

// === Render ===

/** Renders artists from state */
function renderEvents() {
  const $parties = document.querySelector("#partyList");
  const partiesHTML = state.parties.map((party) => {
    const $party = document.createElement("li");

    $party.innerHTML = `<h2>${party.name}</h2>
    <time datetime="${party.date}">${party.date}</ time>
    <address>${party.location}</address>
    <p>${party.description}</p>
    <button data-id="${party.id}">Delete</ button>`;

    const deleteButton = $party.querySelector("button");
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = deleteButton.getAttribute("data-id");
      await deletePost(id);
    });
    return $party;
  });
  $parties.replaceChildren(...partiesHTML);
}

/** Syncs state with the API and rerender */
async function render() {
  await getParties();
  renderEvents();
}

// === Script ===

render();

// TODO: Add artist with form data when the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const event = {
    name: form.partyName.value,
    description: form.description.value,
    date: form.date.value,
    location: form.location.value,
  };

  await addEvents(event);
  render();
});

async function deletePost(id) {
  console.log(id);
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Cannot delete the event.");
    }
  } catch (err) {
    console.error(err);
  }
  await getParties();
  renderEvents();
}
