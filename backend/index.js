// OCR сервис с использованием Claude AI и Swagger документацией
// npm install express multer axios form-data dotenv swagger-ui-express

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

// Настройка для статических файлов (включая swagger.json)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Загрузка Swagger документации
const swaggerDocument = require("./public/swagger.json");

// Настройка Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Только изображения разрешены!"), false);
    }
  },
});

// Функция для взаимодействия с Anthropic API
async function extractTextWithClaude(imagePath) {
  try {
    // Создаем новый FormData объект для отправки
    const fileBuffer = fs.readFileSync(imagePath);
    const mimeType =
      path.extname(imagePath).toLowerCase() === ".png"
        ? "image/png"
        : "image/jpeg";

    // Создаем message объект с системным prompt и изображением
    const message = {
      role: "user",
      content: [
        {
          type: "text",
          text: "Распознай весь текст с этого изображения и верни его в точности как он написан. Форматируй текст, сохраняя структуру оригинала. Не добавляй никаких своих комментариев или объяснений, только извлеченный текст.",
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType,
            data: fileBuffer.toString("base64"),
          },
        },
      ],
    };

    // Создаем payload для API запроса
    const payload = {
      model: "claude-3-7-sonnet-20250219",
      messages: [message],
      max_tokens: 4000,
    };

    // Отправляем запрос к API Anthropic
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      payload,
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    // Извлекаем текст из ответа
    return response.data.content[0].text;
  } catch (error) {
    console.error("Ошибка при обращении к Anthropic API:", error);
    if (error.response) {
      console.error("Ответ API:", error.response.data);
    }
    throw new Error("Ошибка при распознавании текста");
  }
}

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Что-то пошло не так!",
  });
});

// Создаем POST маршрут для обработки изображений
app.post("/api/ocr/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Изображение не загружено" });
    }

    const imagePath = req.file.path;

    // Извлекаем текст с изображения с помощью Claude AI
    const extractedText = await extractTextWithClaude(imagePath);

    // Удаляем временный файл после обработки
    fs.unlinkSync(imagePath);

    // Отправляем результат
    res.json({ text: extractedText });
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error);
    res
      .status(500)
      .json({ error: error.message || "Ошибка при обработке изображения" });
  }
});

// Добавляем маршрут для проверки здоровья сервиса
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "OCR сервис работает нормально" });
});

// Запускаем сервер
app.listen(process.env.PORT, () => {
  console.log(`OCR сервис запущен на порту ${process.env.PORT}`);
  console.log(
    `Swagger документация доступна по адресу: http://localhost:${process.env.PORT}/api-docs`
  );
});
