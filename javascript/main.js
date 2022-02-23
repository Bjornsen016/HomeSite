const main = document.getElementById("main-container");
console.log(main);

const accordian = document.createElement("div");

accordian.innerHTML = /*html*/ `
<div class="accordion" id="accordion">
<div class="accordion-item">
    <h2 class="accordion-header" id="heading-weather">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-weather" aria-expanded="true" aria-controls="collapse-weather">
            Väder
        </button>
    </h2>
    <div id="collapse-weather" class="accordion-collapse collapse" aria-labelledby="heading-weather"
        data-bs-parent="#accordion">
        <div id="weather-body" class="accordion-body">

            <img class="img-fluid" src="https://www.yr.no/en/content/2-2696644/meteogram.svg"
                alt="Prognos inte hittad">

        </div>
    </div>
</div>
<div class="accordion-item">
    <h2 class="accordion-header" id="headingBus">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapseBus" aria-expanded="true" aria-controls="collapseBus">
            Västtrafik
        </button>
    </h2>
    <div id="collapseBus" class="accordion-collapse collapse show" aria-labelledby="headingBus"
        data-bs-parent="#accordion">
        <div class="accordion-body" id="accordian-bus-body">
                        
        </div>
    </div>
</div>
</div>

`;

main.appendChild(accordian);

let accordianString = /* html */ `
<div class="accordion" id="accordion1">
<div class="accordion-item">
    <h2 class="accordion-header" id="heading1">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
            Accordion Item #1
        </button>
    </h2>
    <div id="collapse1" class="accordion-collapse collapse show" aria-labelledby="heading1"
        data-bs-parent="#accordion1">
        <div class="accordion-body">
            <img class="img-fluid" src="https://www.yr.no/en/content/2-2696644/meteogram.svg" alt="Prognos inte hittad">
            <iframe
            src="https://avgangstavla.vasttrafik.se/?source=vasttrafikse-stopareadetailspage&stopAreaGid=9021014017320000"
            frameborder="1"></iframe>
            </div>
    </div>
</div>
</div>
`;

async function getToken() {
	const json = await fetch("https://api.vasttrafik.se/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials&scope=device_123&client_id=jfSHkpiFsEKG8RgFzdfeGl3W97Ma&client_secret=rqSiqnN_eQV2qHeHgzEtqo7ahVEa",
	}).then((res) => res.json());

	return json;
}

const token = await getToken();

console.log(token);

async function getDepBoard(token, stopId, stopIdWhereTo) {
	("9022014005279002"); /* pilgatan id */
	("9022014017320004"); /* gråbo id */
	("9022014017434001"); /* Aggetorpsvägen id */

	let now = new Date().toLocaleTimeString();
	let today = new Date().toLocaleDateString();
	console.log(now);
	console.log(today);
	/* let lat = "57.843803299198406";
	let long = "12.291675805750685";
	let urlGråbo = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${stopId}&date=${today}&time=18%3A20&direction=9022014005279002&format=json`; */

	const url = new URL("https://api.vasttrafik.se");
	url.pathname = "/bin/rest.exe/v2/departureBoard";
	url.searchParams.set("id", stopId);
	url.searchParams.set("date", today);
	url.searchParams.set("time", now);
	url.searchParams.set("direction", stopIdWhereTo);
	url.searchParams.set("format", "json");

	/* let urll = `https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?originCoordLat=${lat}&originCoordLong=${long}&format=json`; */

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
await getDepBoard(token, 9022014017320004, 9022014005279002);
getDepBoard(token, 9022014005279002, 9022014017320004);
