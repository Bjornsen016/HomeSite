import {} from "./utlis.js";
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
export async function getDepBoard(token, stopId, stopIdWhereTo, header) {
	const data = await getDepInfo(token, stopId, stopIdWhereTo);

	const navTabBus = document.getElementById("nav-tab-bus");
	const button = createBusTabButton(header);
	navTabBus.appendChild(button);

	const navTabBusContent = document.getElementById("nav-tab-content-bus");
	const content = createDepInfoContent(data, header);
	navTabBusContent.appendChild(content);
}

async function getDepInfo(token, stopId, stopIdWhereTo) {
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

	return data;
}

function createBusTabButton(header) {
	const button = document.createElement("button");
	button.classList.add("nav-link");
	button.dataset.bsToggle = "tab";
	button.dataset.bsTarget = `#bus-${header}`;
	button.setAttribute("type", "button");
	button.setAttribute("role", "tab");
	button.setAttribute("id", `tab-bus-${header}`);
	button.ariaControls = `bus-${header}`;
	button.ariaSelected = "false";
	button.innerText = header;

	return button;
}

function createDepInfoContent(depInfo, header) {
	const container = document.createElement("div");
	container.classList.add("tab-pane", "fade", "hidden");
	container.setAttribute("id", `bus-${header}`);
	container.setAttribute("role", `tabpanel`);
	container.ariaLabelledby = `tab-bus-${header}`;

	const card = document.createElement("article");
	card.classList.add("card");

	const cardHeader = document.createElement("h5");
	cardHeader.classList.add("card-header", "justify-content-between");
	cardHeader.style.display = "flex";
	cardHeader.innerHTML = `<div>${depInfo.DepartureBoard.Departure[0].stop}</div><div>${depInfo.DepartureBoard.servertime}</div>`;
	card.appendChild(cardHeader);

	const table = createTable(depInfo);

	card.appendChild(table);
	container.appendChild(card);

	return container;
}

function createTable(depInfo) {
	const table = document.createElement("table");
	table.classList.add(
		"table",
		"table-dark",
		"table-striped",
		"table-borderless"
	);
	const thead = document.createElement("thead");
	const trhead = document.createElement("tr");

	const headingArr = ["Buss", "Riktning", "Avgångstid"];
	headingArr.forEach((str, index) => {
		const th = document.createElement("th");
		if (index === 2) th.style.textAlign = "end";
		th.setAttribute("scope", "col");
		th.innerText = str;
		trhead.appendChild(th);
	});

	thead.appendChild(trhead);
	table.appendChild(thead);

	const tableBody = document.createElement("tbody");

	depInfo.DepartureBoard.Departure.every((dep, index) => {
		if (index > 5) return false;

		const tableRow = document.createElement("tr");

		const contentArr = [dep.sname, dep.direction.trimFromComma(), dep.time];

		contentArr.forEach((str, index) => {
			const td = document.createElement("td");

			if (index === 0) {
				td.setAttribute("scope", "row");
				const span = document.createElement("span");
				span.style.color = dep.fgColor;
				span.style.backgroundColor = dep.bgColor;
				span.style.fontSize = "1.2rem";
				span.style.paddingLeft = "4px";
				span.style.paddingRight = "4px";
				span.style.fontWeight = "bold";
				span.innerText = str;
				td.appendChild(span);
			} else if (index === 2) {
				td.style.textAlign = "end";
				td.style.fontSize = "1.2rem";

				const departureTime = new Date(dep.date + " " + str);
				const serverTime = new Date(
					depInfo.DepartureBoard.serverdate +
						" " +
						depInfo.DepartureBoard.servertime
				);

				const minBetweenNowAndDep =
					Math.abs((serverTime.getTime() - departureTime.getTime()) / 1000) /
					60;

				td.innerText = str + ` (${minBetweenNowAndDep} min)`;
			} else {
				td.style.fontSize = "1.2rem";
				td.innerText = str;
			}

			tableRow.appendChild(td);
		});

		tableBody.appendChild(tableRow);
		table.appendChild(tableBody);

		return true;
	});
	return table;
}
