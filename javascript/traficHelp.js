export async function getToken() {
	const json = await fetch("https://api.vasttrafik.se/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials&scope=device_123&client_id=jfSHkpiFsEKG8RgFzdfeGl3W97Ma&client_secret=rqSiqnN_eQV2qHeHgzEtqo7ahVEa",
	}).then((res) => res.json());

	return json;
}
/**
 *
 * @param {*} token
 * @param {*} stopId examples - pilgatan: "9022014005279002" || gråbo: "9022014017320004" || Aggetorpsvägen: "9022014017434001"
 * @param {*} stopIdWhereTo examples - pilgatan: "9022014005279002" || gråbo: "9022014017320004" || Aggetorpsvägen: "9022014017434001"
 */
export async function getDepBoard(token, stopId, stopIdWhereTo) {
	("9022014005279002"); /* pilgatan id */
	("9022014017320004"); /* gråbo id */
	("9022014017434001"); /* Aggetorpsvägen id */

	let now = new Date().toLocaleTimeString();
	let today = new Date().toLocaleDateString();

	const url = new URL("https://api.vasttrafik.se");
	url.pathname = "/bin/rest.exe/v2/departureBoard";
	url.searchParams.set("id", stopId);
	url.searchParams.set("date", today);
	url.searchParams.set("time", now);
	url.searchParams.set("direction", stopIdWhereTo);
	url.searchParams.set("format", "json");

	const data = await fetch(url, {
		metod: "GET",
		headers: {
			Authorization: `${token.token_type} ${token.access_token}`,
		},
	}).then((res) => res.json());

	console.log(data);

	const accordianBus = document.getElementById("accordian-bus-body");
	const card = document.createElement("article");
	card.classList.add("card");
	const cardHeader = document.createElement("h5");
	cardHeader.classList.add("card-header");
	cardHeader.innerText = `${data.DepartureBoard.Departure[0].stop} | ${data.DepartureBoard.servertime}`;
	card.appendChild(cardHeader);
	const cardBody = document.createElement("ul");
	cardBody.classList.add("list-group", "list-group-flush");

	data.DepartureBoard.Departure.every((dep, index) => {
		if (index > 5) return false;

		const cardRow = document.createElement("li");
		cardRow.classList.add("list-group-item");

		cardRow.innerText = `${dep.sname} - | ${dep.direction}  | - ${dep.rtTime} `;

		cardBody.appendChild(cardRow);
		card.appendChild(cardBody);

		return true;
	});
	accordianBus.appendChild(card);
}
