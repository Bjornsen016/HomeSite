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
    <div id="collapseBus" class="accordion-collapse collapse" aria-labelledby="headingBus"
        data-bs-parent="#accordion">
        <div class="accordion-body" id="accordian-bus-body">
                        
        </div>
    </div>
</div>
<div class="accordion-item">
    <h2 class="accordion-header" id="heading-handla">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-handla" aria-expanded="true" aria-controls="collapse-handla">
            Handlalista
        </button>
    </h2>
    <div id="collapse-handla" class="accordion-collapse collapse" aria-labelledby="heading-handla"
        data-bs-parent="#accordion">
        <div class="accordion-body accordian-handla-body" id="accordian-handla-body">

        </div>
    </div>
</div>
</div>

`;

main.appendChild(accordian);

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

async function getDepBoard(token, stopId, stopIdWhereTo) {
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

async function logInToTodoApp() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		email: "kim.bjornsen@hotmail.com",
		password: "laika016",
	});

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
	};

	const todoToken = await fetch(
		"https://api-nodejs-todolist.herokuapp.com/user/login",
		requestOptions
	)
		.then((response) => response.json())
		.catch((error) => console.log("error", error));

	console.log(todoToken);
	return todoToken.token;
}

async function addTodo(token, whatToDo) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${token}`);
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		description: whatToDo,
	});

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
	};

	return fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
		.then((response) => response.json())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
}
async function getTodos(token) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${token}`);
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: "GET",
		headers: myHeaders,
		redirect: "follow",
	};

	const data = await fetch(
		"https://api-nodejs-todolist.herokuapp.com/task",
		requestOptions
	)
		.then((response) => response.json())
		.catch((error) => console.log("error", error));
	console.log(data);
	return data;
}

function printTodos(todoList, token) {
	const todoHtmlEl = document.getElementById("accordian-handla-body");

	todoHtmlEl.innerText = "";
	const addNewTodoBtn = document.createElement("button");

	addNewTodoBtn.classList.add("btn", "btn-outline-primary");
	addNewTodoBtn.style.width = "150px";
	addNewTodoBtn.style.alignSelf = "center";
	addNewTodoBtn.style.margin = "8px";
	addNewTodoBtn.innerText = "Skapa ny todo";

	addNewTodoBtn.addEventListener("click", async () => {
		const what = prompt("Vad vill du göra?");
		await addTodo(token, what);
		const list = await getTodos(token);
		printTodos(list.data, token);
	});

	todoHtmlEl.appendChild(addNewTodoBtn);
	const todoUl = document.createElement("ul");
	todoUl.classList.add("list-group");

	todoList.forEach((todo) => {
		const liEl = document.createElement("li");
		liEl.id = "todo: " + todo._id;
		liEl.classList.add("list-group-item");

		let desc = document.createElement("div");
		desc.innerText = `${todo.description}`;
		liEl.appendChild(desc);

		let compl = document.createElement("button");
		compl.classList.add("btn");
		compl.id = todo._id;
		compl.classList.add(todo.completed);
		if (todo.completed) {
			compl.innerText = `Gjord: Ja`;
			compl.classList.add("btn-success");
		} else {
			compl.innerText = `Gjord: Nej`;
			compl.classList.add("btn-danger");
		}
		compl.addEventListener("click", (event) => {
			console.log(event.target);
			let boolean;
			const elementClasses = event.target.classList;
			if (elementClasses.contains("false")) boolean = false;
			else boolean = true;
			toggleCompleteTodo(event.target.id, event.target, boolean, token);
		});
		liEl.appendChild(compl);

		todoUl.appendChild(liEl);
	});
	todoHtmlEl.appendChild(todoUl);
}

function toggleCompleteTodo(id, elem, compl, token) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${token}`);
	myHeaders.append("Content-Type", "application/json");

	compl = !compl;

	var raw = JSON.stringify({
		completed: compl,
	});

	var requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
	};

	fetch(`https://api-nodejs-todolist.herokuapp.com/task/${id}`, requestOptions)
		.then((response) => response.json())
		.then((result) => {
			const list = elem.classList;

			if (list.contains("false")) {
				elem.classList.replace("false", "true");
				elem.classList.replace("btn-danger", "btn-success");
				elem.innerText = "Gjord: Ja";
			} else if (list.contains("true")) {
				elem.classList.replace("true", "false");
				elem.classList.replace("btn-success", "btn-danger");
				elem.innerText = "Gjord: Nej";
			}

			console.log(result);
		})
		.catch((error) => console.log("error", error));
}

async function removeTodo(token, id) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${token}`);
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: "DELETE",
		headers: myHeaders,
		redirect: "follow",
	};

	return fetch(
		`https://api-nodejs-todolist.herokuapp.com/task/${id}`,
		requestOptions
	)
		.then((response) => response.json())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
}

const token = await getToken();

console.log(token);

await getDepBoard(token, 9022014017320004, 9022014005279002);
getDepBoard(token, 9022014005279002, 9022014017320004);

const todoToken = await logInToTodoApp();

const todos = await getTodos(todoToken);

printTodos(todos.data, todoToken);

/* removeTodo(todoToken, "62168b77990fef0017469409"); */
