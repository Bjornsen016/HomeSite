import { getToken, getDepBoard } from "./traficHelp.js";
import { logInToTodoApp, getTodos, printTodos } from "./TodoHelp.js";

init();

/* removeTodo(todoToken, "62168b77990fef0017469409"); */

async function init() {
	renderMain();

	const token = await getToken();

	console.log(token);

	getDepBoard(token, 9022014017320004, 9022014005279002, "Gråbo");
	getDepBoard(token, 9022014005147004, 9022014005279002, "Olofstorp-Västra");
	getDepBoard(token, 9022014005279002, 9022014017320004, "Pilgatan");

	const todoToken = await logInToTodoApp(
		"kim.bjornsen@hotmail.com",
		"laika016"
	);
	const shoppingToken = await logInToTodoApp(
		"kim.bjornsen@programmer.net",
		"laika016"
	);

	if (typeof todoToken === "string") {
		const todos = await getTodos(todoToken);
		printTodos(todos.data, todoToken, "Att-göra");
	} else alert("Error, kunde inte hämta Att-göra listan. Prova igen.");

	if (typeof shoppingToken === "string") {
		const shopping = await getTodos(shoppingToken);
		printTodos(shopping.data, shoppingToken, "Handla");
	} else alert("Error, kunde inte hämta Handla listan. Prova igen.");
}

function renderMain() {
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
    
            <nav>
            <div class="nav nav-tabs" id="nav-tab-weather" role="tablist">
                <button class="nav-link active" id="tab-weather-home" data-bs-toggle="tab"
                    data-bs-target="#weather-home" type="button" role="tab" aria-controls="weather-home"
                    aria-selected="true">Gråbo</button>
                <button class="nav-link" id="tab-weather-funasdalen" data-bs-toggle="tab"
                    data-bs-target="#weather-funasdalen" type="button" role="tab"
                    aria-controls="weather-funasdalen" aria-selected="false">Funäsdalen</button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tab-content-weather">
            <div class="tab-pane fade show active" id="weather-home" role="tabpanel"
                aria-labelledby="tab-weather-home"><img class="img-fluid"
                    src="https://www.yr.no/en/content/2-2696644/meteogram.svg"
                    alt="Prognos för Gråbo inte hittad"></div>
            <div class="tab-pane fade" id="weather-funasdalen" role="tabpanel"
                aria-labelledby="tab-weather-funasdalen"><img class="img-fluid"
                    src="https://www.yr.no/en/content/2-2713447/meteogram.svg"
                    alt="Prognos för Funäsdalen inte hittad"></div>
        </div>
    
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
                   
            <nav>
                <div class="nav nav-tabs" id="nav-tab-bus" role="tablist">
                </div>
            </nav>
            <div class="tab-content" id="nav-tab-content-bus">
            </div>

            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading-handla">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-handla" aria-expanded="true" aria-controls="collapse-handla">
                Listor
            </button>
        </h2>
        <div id="collapse-handla" class="accordion-collapse collapse" aria-labelledby="heading-handla"
            data-bs-parent="#accordion">
            <div class="accordion-body accordian-handla-body" id="accordian-handla-body">
    
            <nav>
                <div class="nav nav-tabs" id="nav-tab-lists" role="tablist">
                </div>
            </nav>
            <div class="tab-content" id="nav-tab-content-lists">
            </div>

        </div>

            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading-hus">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-hus" aria-expanded="true" aria-controls="collapse-hus">
                Huset
            </button>
        </h2>
        <div id="collapse-hus" class="accordion-collapse collapse" aria-labelledby="heading-hus"
            data-bs-parent="#accordion">
            <div class="accordion-body" id="accordian-hus-body">
                   
            <nav>
            <div class="nav nav-tabs" id="nav-tab-hus" role="tablist">
                <button class="nav-link active" id="tab-hus-sopor" data-bs-toggle="tab"
                    data-bs-target="#hus-sopor" type="button" role="tab" aria-controls="hus-sopor"
                    aria-selected="true">Sopor</button>
                <button class="nav-link" id="tab-hus-renovering" data-bs-toggle="tab"
                    data-bs-target="#hus-renovering" type="button" role="tab" aria-controls="hus-renovering"
                    aria-selected="true">Renovering</button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tab-content-hus">
            <div class="tab-pane fade show active" id="hus-sopor" role="tabpanel"
                aria-labelledby="tab-hus-sopor">
                SOPOR
            </div>
            <div class="tab-pane fade" id="hus-renovering" role="tabpanel"
                aria-labelledby="tab-hus-renovering">
                RENOVERING
            </div>
        </div>


            </div>
        </div>
    </div>
    </div>
    
    `;
	main.appendChild(accordian);
}
