"use strict";

// ======================================
// ELEMENTS
// ======================================

const earningsInput = document.getElementById("earnings");
const ordersInput = document.getElementById("orders");
const distanceInput = document.getElementById("distance");
const hoursInput = document.getElementById("hours");

const petrolPriceInput = document.getElementById("petrol-price");
const mileageInput = document.getElementById("mileage");

const maintenanceInput = document.getElementById("maintenance");
const platformFeesInput = document.getElementById("platform-fees");
const otherExpensesInput = document.getElementById("other-expenses");

const calculateButton =
    document.getElementById("calculate-button");

const advancedToggle =
    document.getElementById("advanced-toggle");

const advancedPanel =
    document.getElementById("advanced-panel");

const advancedIcon =
    document.getElementById("advanced-icon");

const formMessage =
    document.getElementById("form-message");

const savedBikeMessage =
    document.getElementById("saved-bike-message");

const savedBikeSummary =
    document.getElementById("saved-bike-summary");

const resetBikeButton =
    document.getElementById("reset-bike-settings");

const feeFixedButton =
    document.getElementById("fee-fixed");

const feePercentButton =
    document.getElementById("fee-percent");

const netProfitOutput =
    document.getElementById("net-profit");

const fuelCostOutput =
    document.getElementById("fuel-cost");

const maintenanceCostOutput =
    document.getElementById("maintenance-cost");

const platformFeeOutput =
    document.getElementById("platform-fee-result");

const otherExpensesOutput =
    document.getElementById("other-expenses-result");

const perHourOutput =
    document.getElementById("per-hour");

const perOrderOutput =
    document.getElementById("per-order");

const perKmOutput =
    document.getElementById("per-km");

const resultSubtext =
    document.getElementById("result-subtext");


// ======================================
// SETTINGS
// ======================================

const STORAGE_KEY =
    "riderProfitBikeSettings";

const DEFAULT_SETTINGS = {
    petrolPrice: 114,
    mileage: 45
};

let platformFeeMode = "fixed";


// ======================================
// HELPERS
// ======================================

function getNumber(input) {

    const value =
        Number.parseFloat(input.value);

    if (
        !Number.isFinite(value) ||
        value < 0
    ) {
        return 0;
    }

    return value;
}


function formatMoney(value) {

    if (!Number.isFinite(value)) {
        return "₹0";
    }

    return "₹" +
        value.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
}


// ======================================
// SAVED SETTINGS
// ======================================

function getSavedSettings() {

    try {

        const raw =
            localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const settings =
            JSON.parse(raw);

        if (
            !settings ||
            typeof settings !== "object"
        ) {
            return null;
        }

        return settings;

    } catch {

        return null;
    }
}


// ======================================
// DEFAULT ESTIMATE MESSAGE
// ======================================

function showDefaultBikeMessage() {

    savedBikeMessage.hidden = false;

    const icon =
        savedBikeMessage.querySelector(".saved-icon");

    const strong =
        savedBikeMessage.querySelector("strong");

    if (icon) {
        icon.textContent = "i";
    }

    if (strong) {
        strong.textContent =
            "Using default bike estimates";
    }

    savedBikeSummary.textContent =
        `₹${DEFAULT_SETTINGS.petrolPrice}/L · ${DEFAULT_SETTINGS.mileage} km/L`;

    resetBikeButton.style.display = "none";
}


// ======================================
// SAVED BIKE MESSAGE
// ======================================

function showSavedBikeMessage() {

    const saved =
        getSavedSettings();

    if (!saved) {

        showDefaultBikeMessage();

        return;
    }


    const petrol =
        Number.parseFloat(
            saved.petrolPrice
        );

    const mileage =
        Number.parseFloat(
            saved.mileage
        );


    if (
        !Number.isFinite(petrol) ||
        !Number.isFinite(mileage)
    ) {

        showDefaultBikeMessage();

        return;
    }


    const icon =
        savedBikeMessage.querySelector(".saved-icon");

    const strong =
        savedBikeMessage.querySelector("strong");

    if (icon) {
        icon.textContent = "✓";
    }

    if (strong) {
        strong.textContent =
            "Using your saved bike settings";
    }

    savedBikeSummary.textContent =
        `₹${petrol}/L · ${mileage} km/L`;

    savedBikeMessage.hidden = false;

    resetBikeButton.style.display =
        "block";
}


// ======================================
// LOAD SETTINGS
// ======================================

function loadSettings() {

    const saved =
        getSavedSettings();


    // FIRST-TIME USER

    if (!saved) {

        petrolPriceInput.value =
            DEFAULT_SETTINGS.petrolPrice;

        mileageInput.value =
            DEFAULT_SETTINGS.mileage;

        showDefaultBikeMessage();

        return;
    }


    // RETURNING USER

    const petrol =
        Number.parseFloat(
            saved.petrolPrice
        );

    const mileage =
        Number.parseFloat(
            saved.mileage
        );


    petrolPriceInput.value =
        Number.isFinite(petrol) && petrol > 0
            ? petrol
            : DEFAULT_SETTINGS.petrolPrice;


    mileageInput.value =
        Number.isFinite(mileage) && mileage > 0
            ? mileage
            : DEFAULT_SETTINGS.mileage;


    // Restore maintenance only if saved.

    const maintenance =
        Number.parseFloat(
            saved.maintenance
        );

    if (
        Number.isFinite(maintenance) &&
        maintenance > 0
    ) {

        maintenanceInput.value =
            maintenance;
    }


    showSavedBikeMessage();
}


// ======================================
// SAVE BIKE SETTINGS
// ======================================

function saveBikeSettings() {

    const existing =
        getSavedSettings() || {};


    const settings = {

        petrolPrice:
            getNumber(
                petrolPriceInput
            ),

        mileage:
            getNumber(
                mileageInput
            )
    };


    if (
        Number.isFinite(
            Number.parseFloat(
                existing.maintenance
            )
        ) &&
        Number.parseFloat(
            existing.maintenance
        ) > 0
    ) {

        settings.maintenance =
            Number.parseFloat(
                existing.maintenance
            );
    }


    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

    } catch {

        return;
    }


    showSavedBikeMessage();
}


// ======================================
// RESET SAVED SETTINGS
// ======================================

resetBikeButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            STORAGE_KEY
        );

        petrolPriceInput.value =
            DEFAULT_SETTINGS.petrolPrice;

        mileageInput.value =
            DEFAULT_SETTINGS.mileage;

        maintenanceInput.value =
            "";

        showDefaultBikeMessage();

        formMessage.textContent =
            "Saved bike settings cleared.";

        formMessage.classList.add(
            "success-message"
        );
    }
);


// ======================================
// ADVANCED PANEL
// ======================================

advancedToggle.addEventListener(
    "click",
    function () {

        const isOpen =
            advancedToggle.getAttribute(
                "aria-expanded"
            ) === "true";


        if (isOpen) {

            advancedToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            advancedPanel.hidden = true;

            advancedIcon.textContent = "+";

        } else {

            advancedToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            advancedPanel.hidden = false;

            advancedIcon.textContent = "−";
        }
    }
);


// ======================================
// PLATFORM FEE
// ======================================

feeFixedButton.addEventListener(
    "click",
    function () {

        platformFeeMode = "fixed";

        feeFixedButton.classList.add("active");

        feePercentButton.classList.remove("active");

        platformFeesInput.placeholder =
            "e.g. 50";

        platformFeesInput.max = "";
    }
);


feePercentButton.addEventListener(
    "click",
    function () {

        platformFeeMode = "percent";

        feePercentButton.classList.add("active");

        feeFixedButton.classList.remove("active");

        platformFeesInput.placeholder =
            "e.g. 5";

        platformFeesInput.max = "100";
    }
);


// ======================================
// VALIDATION
// ======================================

function validateBasicInputs() {

    const missing = [];


    if (getNumber(earningsInput) <= 0) {
        missing.push("earnings");
    }

    if (getNumber(ordersInput) <= 0) {
        missing.push("orders");
    }

    if (getNumber(distanceInput) <= 0) {
        missing.push("distance");
    }

    if (getNumber(hoursInput) <= 0) {
        missing.push("working time");
    }

    if (getNumber(petrolPriceInput) <= 0) {
        missing.push("petrol price");
    }

    if (getNumber(mileageInput) <= 0) {
        missing.push("bike mileage");
    }


    if (missing.length === 0) {
        return "";
    }


    if (missing.length === 1) {
        return `Please enter your ${missing[0]}.`;
    }


    return `Please enter your ${
        missing.slice(0, -1).join(", ")
    } and ${
        missing.at(-1)
    }.`;
}


// ======================================
// CALCULATE
// ======================================

function calculateProfit() {

    formMessage.textContent = "";

    formMessage.classList.remove(
        "success-message"
    );


    const error =
        validateBasicInputs();


    if (error) {

        formMessage.textContent =
            error;

        return;
    }


    const earnings =
        getNumber(earningsInput);

    const orders =
        getNumber(ordersInput);

    const distance =
        getNumber(distanceInput);

    const hours =
        getNumber(hoursInput);

    const petrolPrice =
        getNumber(petrolPriceInput);

    const mileage =
        getNumber(mileageInput);

    const maintenance =
        getNumber(maintenanceInput);

    const platformInput =
        getNumber(platformFeesInput);

    const otherExpenses =
        getNumber(otherExpensesInput);


    // ==================================
    // FUEL
    // ==================================

    const fuelUsed =
        distance / mileage;

    const fuelCost =
        fuelUsed * petrolPrice;


    // ==================================
    // MAINTENANCE
    // ==================================

    const maintenanceCost =
        distance * maintenance;


    // ==================================
    // PLATFORM FEE
    // ==================================

    let platformFee = 0;


    if (
        platformFeeMode === "percent"
    ) {

        const percentage =
            Math.min(
                platformInput,
                100
            );

        platformFee =
            earnings *
            (percentage / 100);

    } else {

        platformFee =
            platformInput;
    }


    // ==================================
    // TOTAL EXPENSES
    // ==================================

    const totalExpenses =
        fuelCost +
        maintenanceCost +
        platformFee +
        otherExpenses;


    const realProfit =
        earnings -
        totalExpenses;


    // ==================================
    // AVERAGES
    // ==================================

    const perHour =
        realProfit / hours;

    const perOrder =
        realProfit / orders;

    const perKm =
        realProfit / distance;


    // ==================================
    // DISPLAY
    // ==================================

    netProfitOutput.textContent =
        formatMoney(realProfit);

    fuelCostOutput.textContent =
        formatMoney(fuelCost);


    maintenanceCostOutput.textContent =
        maintenance > 0
            ? formatMoney(maintenanceCost)
            : "Not added";


    platformFeeOutput.textContent =
        platformInput > 0
            ? formatMoney(platformFee)
            : "Not added";


    otherExpensesOutput.textContent =
        otherExpenses > 0
            ? formatMoney(otherExpenses)
            : "Not added";


    perHourOutput.textContent =
        formatMoney(perHour);

    perOrderOutput.textContent =
        formatMoney(perOrder);

    perKmOutput.textContent =
        formatMoney(perKm);


    // ==================================
    // RESULT MESSAGE
    // ==================================

    if (realProfit < 0) {

        resultSubtext.textContent =
            "Your expenses were higher than your earnings.";

    } else if (realProfit === 0) {

        resultSubtext.textContent =
            "Your earnings exactly covered your estimated expenses.";

    } else {

        resultSubtext.textContent =
            `After estimated fuel cost using ₹${petrolPrice}/L and ${mileage} km/L.`;
    }


    // ==================================
    // SAVE BIKE
    // ==================================

    saveBikeSettings();


    // Save maintenance only when entered.

    if (maintenance > 0) {

        const settings =
            getSavedSettings() || {};

        settings.petrolPrice =
            petrolPrice;

        settings.mileage =
            mileage;

        settings.maintenance =
            maintenance;


        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

        } catch {
            // Ignore storage errors.
        }
    }


    formMessage.textContent =
        "✓ Calculation updated.";

    formMessage.classList.add(
        "success-message"
    );


    // Scroll to results on mobile.

    if (window.innerWidth < 700) {

        document
            .getElementById("results")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
}


// ======================================
// CALCULATE BUTTON
// ======================================

calculateButton.addEventListener(
    "click",
    calculateProfit
);


// ======================================
// ENTER KEY
// ======================================

document
    .querySelectorAll("input")
    .forEach(function(input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    calculateProfit();
                }
            }
        );
    });


// ======================================
// START
// ======================================

loadSettings();