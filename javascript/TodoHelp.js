export function toggleCompleteTodo(id, elem, compl, token) {
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
				elem.classList.replace("bg-danger", "bg-success");
				elem.innerText = "Gjord: Ja";
			} else if (list.contains("true")) {
				elem.classList.replace("true", "false");
				elem.classList.replace("bg-success", "bg-danger");
				elem.innerText = "Gjord: Nej";
			}

			console.log(result);
		})
		.catch((error) => console.log("error", error));
}

export async function removeTodo(token, id) {
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

function createListTabButton(header) {
	const button = document.createElement("button");
	button.classList.add("nav-link");
	button.dataset.bsToggle = "tab";
	button.dataset.bsTarget = `#list-${header}`;
	button.setAttribute("type", "button");
	button.setAttribute("role", "tab");
	button.setAttribute("id", `tab-list-${header}`);
	button.ariaControls = `list-${header}`;
	button.ariaSelected = "false";
	button.innerText = header;

	return button;
}

function createListContent(todoList, header, token) {
	const container = document.createElement("div");
	container.classList.add("tab-pane", "fade", "hidden");
	container.setAttribute("id", `list-${header}`);
	container.setAttribute("role", `tabpanel`);
	container.ariaLabelledby = `tab-list-${header}`;

	const card = document.createElement("article");
	card.classList.add("card");

	const cardHeader = document.createElement("h5");
	cardHeader.classList.add("card-header", "justify-content-between");
	cardHeader.style.display = "flex";
	cardHeader.innerHTML = header;
	card.appendChild(cardHeader);

	const table = createTable(todoList, token, header);
	const addBtn = addNewTodoButton(token, header);

	card.appendChild(table);
	container.appendChild(card);
	container.appendChild(addBtn);

	return container;
}

function createTable(list, token, header) {
	const table = document.createElement("table");
	table.classList.add(
		"table",
		"table-dark",
		"table-striped",
		"table-borderless"
	);
	const thead = document.createElement("thead");
	const trhead = document.createElement("tr");

	const headingArr = ["Att göra", "Radera"];
	headingArr.forEach((str) => {
		const th = document.createElement("th");
		if (str[0]) th.style.width = "85%";

		th.setAttribute("scope", "col");
		th.innerText = str;
		trhead.appendChild(th);
	});

	thead.appendChild(trhead);
	table.appendChild(thead);

	const tableBody = document.createElement("tbody");

	list.forEach((todo) => {
		const tableRow = document.createElement("tr");

		const contentArr = [[todo.description, todo.completed], "Radera"];

		contentArr.forEach((str, index) => {
			const td = document.createElement("td");
			td.style.fontSize = "1.2rem";
			if (index === 0) {
				td.setAttribute("scope", "row");
				const div = document.createElement("div");
				div.classList.add("form-check");
				const input = document.createElement("input");

				if (str[1] === true)
					input.classList.add("form-check-input", str[1], "bg-success");
				else input.classList.add("form-check-input", str[1], "bg-danger");
				input.setAttribute("type", "checkbox");
				input.id = todo._id;
				input.checked = str[1];
				input.addEventListener("click", (event) => {
					console.log(event.target);
					let boolean;
					const elementClasses = event.target.classList;
					if (elementClasses.contains("false")) boolean = false;
					else boolean = true;
					toggleCompleteTodo(event.target.id, event.target, boolean, token);
				});

				const label = document.createElement("label");
				label.classList.add("form-check-label");
				label.setAttribute("for", todo._id);
				label.innerText = str[0];

				div.appendChild(input);
				div.appendChild(label);
				td.appendChild(div);
			} else if (index === 1) {
				const button = document.createElement("button");
				button.classList.add("btn", "btn-danger", "btn-sm");
				button.id = todo._id;
				button.innerText = "X";

				button.addEventListener("click", async (event) => {
					const confirmRemove = confirm(
						`Är du säker på att du vill ta bort: "${todo.description}"`
					);
					if (!confirmRemove) return;

					await removeTodo(token, event.target.id);
					const newList = await getTodos(token);
					const tabListH = document.getElementById(`tab-list-${header}`);
					tabListH.remove();
					const tabListC = document.getElementById(`list-${header}`);
					tabListC.remove();
					printTodos(newList.data, token, header);
				});

				td.classList.add("justify-content-center");
				td.style.display = "flex";
				td.appendChild(button);
			}

			tableRow.appendChild(td);
		});

		tableBody.appendChild(tableRow);
		table.appendChild(tableBody);
	});
	return table;
}

function addNewTodoButton(token, header) {
	const addNewTodoBtn = document.createElement("button");

	addNewTodoBtn.classList.add("btn", "btn-outline-primary");
	addNewTodoBtn.style.width = "150px";
	addNewTodoBtn.style.alignSelf = "center";
	addNewTodoBtn.style.margin = "8px";
	addNewTodoBtn.innerText = "Lägg till";

	addNewTodoBtn.addEventListener("click", async () => {
		const what = prompt("Vad vill du göra?");
		await addTodo(token, what);
		const list = await getTodos(token);
		const tabListH = document.getElementById(`tab-list-${header}`);
		tabListH.remove();
		const tabListC = document.getElementById(`list-${header}`);
		tabListC.remove();
		printTodos(list.data, token, header);
	});

	return addNewTodoBtn;
}

export function printTodos(todoList, token, header) {
	const listTab = document.getElementById("nav-tab-lists");
	const button = createListTabButton(header);
	listTab.appendChild(button);

	const listTabContent = document.getElementById("nav-tab-content-lists");

	const content = createListContent(todoList, header, token);

	listTabContent.appendChild(content);
}

export async function getTodos(token) {
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

export async function addTodo(token, whatToDo) {
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

export async function logInToTodoApp(user, password) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		email: user,
		password: password,
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
	console.log(todoToken.token);
	return todoToken.token;
}
