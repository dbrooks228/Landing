const canvas = document.getElementById("glowCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match the card size
canvas.width = 322; // Adjust these dimensions based on your requirements
canvas.height = 151;

function drawGlow() {
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configure glow properties
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#6BDBE2";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw the shape for the glow (this shape won't be visible, just its glow)
    ctx.fillStyle = "transparent";
    ctx.fillRect(10, 10, 302, 131); // Adjust as needed

    // Optionally animate
    requestAnimationFrame(drawGlow);
}

drawGlow();