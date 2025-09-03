// A free API key from ExchangeRate-API
const API_KEY = "5b4747b9fb7894f476d47736";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

// DOM elements based on your HTML
const amountInput = document.querySelector("#amountInput");
const fromCurr = document.querySelector("#from");
const toCurr = document.querySelector("#to");
const convertBtn = document.querySelector("#convertBtn");
const convertedDiv = document.querySelector("#converted");
const dropdowns = document.querySelectorAll("select");

// Fill dropdowns with countryList data (Assuming countryList is defined in another file)
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.id === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.id === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    // Change flag when selection changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update exchange rate
const updateExchangeRate = async () => {
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value}`;
    
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value];

        let finalAmount = (amtVal * rate).toFixed(2);
        convertedDiv.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        convertedDiv.innerText = "Error: Could not retrieve exchange rate. Please try again.";
    }
};

// Update flags
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Convert button click
convertBtn.addEventListener("click", () => {
    updateExchangeRate();
});

// Initial load
window.addEventListener("load", () => {
    updateExchangeRate();
    updateFlag(fromCurr);
    updateFlag(toCurr);
});