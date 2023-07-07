import "./style.css";

console.warn("start team");

function getTeamsHTML(team) {
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>x</td>
  </tr>`;
}

function loadTeams() {
  fetch("teams.json")
    .then((r) => r.json())
    .then(function (teams) {
      const htmlTeams = teams.map(getTeamsHTML);
      console.warn(htmlTeams);
      document.querySelector("#teamsTable tbody").innerHTML =
        htmlTeams.join("");
    });
}

loadTeams();
