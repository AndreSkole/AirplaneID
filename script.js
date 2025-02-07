const URL = "https://teachablemachine.withgoogle.com/models/AgaE-oQJM/"; // Path to your model files

let model, labelContainer, maxPredictions, fileInput, dropZone, loader;

// Load the image model and setup the file input
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Get elements
    labelContainer = document.getElementById("label-container");
    fileInput = document.getElementById("imageUpload");
    dropZone = document.getElementById("drop-zone");
    loader = document.getElementById("loader");

    // Set up drag and drop event listeners
    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault(); // Prevent default behavior
        dropZone.classList.add("highlight"); // Add highlight effect
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("highlight"); // Remove highlight
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("highlight");

        if (event.dataTransfer.files.length > 0) {
            fileInput.files = event.dataTransfer.files; // Assign dropped file to input
            handleFileUpload({ target: fileInput }); // Trigger the file upload function
        }
    });
}

// Handle file upload (from input or drag and drop)
function handleFileUpload(event) {
    const file = event.target.files[0];  // Get the file from input
    if (file) {
        loader.style.display = "block"; // Show loader

        const reader = new FileReader();

        reader.onload = async function (e) {
            const image = new Image();
            image.src = e.target.result;

            // 📌 Display the uploaded image
            const uploadedImage = document.getElementById("uploaded-image");
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = "block"; // Show image

            image.onload = async function () {
                await predict(image);
            };
        };
        reader.readAsDataURL(file);
    }
}

// Run the uploaded image through the model
async function predict(image) {
    const prediction = await model.predict(image);
    
    // Find the highest prediction
    let bestMatch = prediction.reduce((max, item) => item.probability > max.probability ? item : max, prediction[0]);
    
    // Display result
    labelContainer.innerHTML = `<p>${bestMatch.className}: ${(bestMatch.probability * 100).toFixed(2)}% Confident</p>`;
    
    // Hide loader once results appear
    loader.style.display = "none";

    // Display info about the detected aircraft
    displayAircraftInfo(bestMatch.className);
}

// Function to display aircraft information
function displayAircraftInfo(aircraft) {
    const aircraftInfo = {
        // Military Transport Aircraft ✈️
        "A400M Atlas": "🛫 A European four-engine turboprop military transport aircraft designed for both tactical and strategic missions.",
        "B-1B Lancer": "💥 A supersonic strategic bomber with variable-sweep wings, used by the USAF.",
        "B-2 spirit": "🕵️ A stealth bomber with a unique flying wing design, built to evade radar detection.",
        "B-52 Stratofortress": "🔴 A long-range strategic bomber that has been in service since the 1950s.",
        "C-130 Hercules": "🚛 A versatile military transport aircraft used for tactical missions, air supply, and special operations.",
        "C-5 Galaxy": "✈️ One of the largest military transport aircraft in the world, used by the USAF for strategic heavy airlift.",
        "C-17 Globemaster III": "🛩️ A modern military transport aircraft known for its ability to operate on short and unprepared runways.",
        "Airbus A300": "🛫 The world's first twin-engine wide-body jet, introduced in the 1970s",
        "Airbus A310": "A shorter, more efficient version of the A300, designed for medium to long-haul routes",
        "Airbus A320": "🛫 A highly popular narrow-body jet known for its efficiency and fly-by-wire controls.",
        "Airbus A330": "🌍 A twin-engine wide-body aircraft commonly used for long-haul routes.",
        "Airbus A340": "A long-range, four-engine wide-body jet, popular for intercontinental flights",
        "Airbus A350": "🔋 A modern, fuel-efficient long-haul aircraft featuring advanced aerodynamics.",
        "Airbus A380": "🏢 The world’s largest passenger aircraft, known for its two full decks.",
       
        "F-35": "pew pew plane"
     
    };
    
    const infoText = aircraftInfo[aircraft] || "Ingen informasjon tilgjengelig for dette flyet.";
    labelContainer.innerHTML += `<p>${infoText}</p>`;
}

// Initialize the model when the page loads
window.onload = init;
