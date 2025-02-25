require('dotenv').config()

console.log("Variables de entorno cargadas:", process.env);  // Ver todas las variables cargadas

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

app.post("/webhook", async (req, res) => {
    try {
        const userMessage = req.body.queryResult.queryText;

        // Llamada a la API de DeepSeek
        const response = await axios.post(DEEPSEEK_URL, {
            model: "deepseek-chat",
            messages: [{ role: "user", content: userMessage }],
        }, {
            headers: { "Authorization": `Bearer ${DEEPSEEK_API_KEY}` }
        });

        const deepseekReply = response.data.choices[0].message.content;

        // Enviar respuesta a Dialogflow
        return res.json({
            fulfillmentText: deepseekReply
        });

    } catch (error) {
        console.error("Error en la API de DeepSeek:", error);
        return res.json({ fulfillmentText: "Hubo un error al procesar tu solicitud." });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API Key: ", DEEPSEEK_API_KEY);
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
