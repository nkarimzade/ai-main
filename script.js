document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const aiResponseDiv = document.getElementById("ai-response");

    const apiUrl = "https://backend-groq-server.onrender.com/ask";

    sendButton.addEventListener("click", async () => {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        aiResponseDiv.innerHTML += `
            <div class="message user-message">
                <div class="bubble"><strong>You:</strong> ${userMessage}</div>
            </div>
        `;
        userInput.value = "";

        const loadingId = `loading-${Date.now()}`;
        aiResponseDiv.innerHTML += `
            <div class="message ai-message" id="${loadingId}">
                <div class="bubble">
                    <strong>KyraxAI:</strong> <div class="spinner"></div>
                </div>
            </div>
        `;
        aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            const loadingDiv = document.getElementById(loadingId);
            if (loadingDiv) loadingDiv.remove();

            if (!response.ok) {
                const errorData = await response.json();
                aiResponseDiv.innerHTML += `
                    <div class="message error-message">
                        <div class="bubble"><strong>Hata:</strong> ${errorData.error}</div>
                    </div>
                `;
                aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
                return;
            }

            const data = await response.json();
            const aiMessage = data.response || data.choices[0].text;

            aiResponseDiv.innerHTML += `
                <div class="message ai-message">
                    <div class="bubble"><strong>KyraxAI:</strong> ${aiMessage}</div>
                </div>
            `;
            aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
        } catch (error) {
            console.error("Bağlantı Hatası:", error);

            const loadingDiv = document.getElementById(loadingId);
            if (loadingDiv) loadingDiv.remove();

            aiResponseDiv.innerHTML += `
                <div class="message error-message">
                    <div class="bubble"><strong>Bağlantı hatası. Sunucu çalışıyor mu?</strong></div>
                </div>
            `;
            aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
        }
    });
});
