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

export function printTodos(todoList, token) {
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

export async function logInToTodoApp() {
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
