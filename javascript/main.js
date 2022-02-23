import { getToken, getDepBoard } from "./traficHelp.js";
import {
	logInToTodoApp,
	getTodos,
	removeTodo,
	printTodos,
} from "./TodoHelp.js";

init();

const token = await getToken();

console.log(token);

await getDepBoard(token, 9022014017320004, 9022014005279002);
getDepBoard(token, 9022014005279002, 9022014017320004);

const todoToken = await logInToTodoApp();

const todos = await getTodos(todoToken);

printTodos(todos.data, todoToken);

/* removeTodo(todoToken, "62168b77990fef0017469409"); */

function init() {
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
                    alt="Prognos för Gråbo inte hittad">
                <img class="img-fluid" src="https://www.yr.no/en/content/2-2713447/meteogram.svg"
                    alt="Prognos för Funäsdalen inte hittad">
    
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
}
