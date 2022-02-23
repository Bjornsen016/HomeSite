const main = document.getElementById("main-container");
console.log(main);

const accordian = document.createElement("div");

accordian.innerHTML = /*html*/ `
<div class="accordion" id="accordion-weather">
<div class="accordion-item">
    <h2 class="accordion-header" id="heading-weather">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-weather" aria-expanded="true" aria-controls="collapse-weather">
            Väder
        </button>
    </h2>
    <div id="collapse-weather" class="accordion-collapse collapse show" aria-labelledby="heading-weather"
        data-bs-parent="#accordion-weather">
        <div id="weather-body" class="accordion-body">

            <img class="img-fluid" src="https://www.yr.no/en/content/2-2696644/meteogram.svg"
                alt="Prognos inte hittad">

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
        </div>
    </div>
</div>
</div>
`;
