import "./style.css";

let allTeams = [];
let editId;

function $(selector) {
  return document.querySelector(selector);
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  }).then((r) => r.json());
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).then((r) => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  }).then((r) => r.json());
}

function getTeamsHTML(team) {
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>
      <button data-id="${team.id}" class="edit-btn action-btn">&#9998</button>
      <button data-id="${team.id}" class="delete-btn action-btn">✖</button>
    </td>
  </tr>`;
}

function getTeamsHTMLInputs(team) {
  return `<tr>
    <td>
      <input
        value="${team.promotion}"
        type="text"
        name="promotion"
        placeholder="Enter Promotion"
        required
      />
    </td>
    <td>
      <input
        value="${team.members}"
        type="text"
        name="members"
        placeholder="Enter Members"
        required
      />
    </td>
    <td>
      <input
        value="${team.name}"
        type="text"
        name="name"
        placeholder="Enter Name"
        required
      />
    </td>
    <td>
      <input
        value="${team.url}"
        type="text"
        name="url"
        placeholder="Enter URL"
        required
      />
    </td>
    <td>
      <button type="submit" class=".action-btn" title="Save" >💾</button>
      <button type="reset" class=".action-btn" title="Cancel" >✖</button>
    </td>
  </tr>`;
}

function renderTeams(teams, editId) {
  const htmlTeams = teams.map((team) => {
    return team.id === editId ? getTeamsHTMLInputs(team) : getTeamsHTML(team);
  });
  $("#teamsTable tbody").innerHTML = htmlTeams.join("");
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then((r) => r.json())
    .then((teams) => {
      allTeams = teams;
      renderTeams(teams);
    });
}

function getTeamValues(parent) {
  const promotion = $(`${parent} input[name=promotion]`).value;
  const members = $(`${parent} input[name=members]`).value;
  const name = $(`${parent} input[name=name]`).value;
  const url = $(`${parent} input[name=url]`).value;
  const team = {
    promotion: promotion,
    members: members,
    name,
    url,
  };
  return team;
}

function onSubmit(e) {
  e.preventDefault();

  console.warn("update or create?");

  const team = getTeamValues(editId ? "tbody" : "tfoot");

  if (editId) {
    team.id = editId;
    console.warn("update...", team);
    updateTeamRequest(team).then((status) => {
      console.warn("updated", status);
      if (status.success) {
        window.location.reload();
      }
    });
  } else {
    createTeamRequest(team).then((status) => {
      console.warn("created", status);
      if (status.success) {
        window.location.reload();
      }
    });
  }
}

function startEdit(id) {
  editId = id;
  console.warn("edit...%o", id, allTeams);
  // const team = allTeams.find((team) => team.id === id);
  renderTeams(allTeams, id);

  document.querySelectorAll("tfoot input").forEach((input) => {
    input.disabled = true;
  });
}

function initEvents() {
  $("#teamsForm").addEventListener("submit", onSubmit);

  $("#teamsTable tbody").addEventListener("click", (e) => {
    if (e.target.matches("button.delete-btn")) {
      const id = e.target.dataset.id;
      // console.warn("delete...%o", id);
      deleteTeamRequest(id).then((status) => {
        // console.info("delete status %o", status);
        if (status.success) {
          window.location.reload();
        }
      });
    } else if (e.target.matches("button.edit-btn")) {
      const id = e.target.dataset.id;
      startEdit(id);
    }
  });
}

loadTeams();
initEvents();
