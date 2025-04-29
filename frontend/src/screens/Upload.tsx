import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState, useRef, ChangeEvent } from "react";

export const Upload = () => {
  const t = useTranslations("UPLOUD");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResponseText("");
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setResponseText(t("ERROR_NO_FILE"));
      return;
    }
    setIsLoading(true);
    setResponseText("");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("https://backend.ala-too.life/api/ocr/image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const responseData = await res.text();
        try {
          // Парсим JSON и извлекаем значение text
          const parsedData = JSON.parse(responseData);
          setResponseText(parsedData.text || responseData);
        } catch (parseError) {
          // Если не удалось распарсить как JSON, показываем исходный текст
          setResponseText(responseData);
        }
      } else {
        const errorText = await res.text();
        setResponseText(errorText);
      }
    } catch (error: any) {
      setResponseText(error.message || t("ERROR_CONNECTION"));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save response as txt file
  const saveAsTxt = () => {
    if (!responseText) return;

    const blob = new Blob([responseText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocr-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to copy response to clipboard
  const copyToClipboard = () => {
    if (!responseText) return;

    navigator.clipboard
      .writeText(responseText)
      .then(() => {
        // You can add a toast notification here if you want
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="w-[70%] min-h-[300px] border-2 rounded-2xl flex flex-col gap-5 items-center justify-center p-4 sm:w-[90%]">
      {/* Скрытый input для выбора файла */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Кнопка открытия файлового диалога */}
      <Button
        className="bg-red-500 text-white"
        onClick={openFileDialog}
        disabled={isLoading}
        startContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 13v8" />
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="m8 17 4-4 4 4" />
          </svg>
        }
      >
        {t("TEXT")}
      </Button>

      {/* Превью загруженного фото и кнопка отправки */}
      {preview && (
        <div className="flex flex-col items-center gap-3">
          <img
            src={preview}
            alt="Preview"
            className="max-w-[200px] rounded-lg shadow-md"
          />
          <Button color="primary" onClick={handleUpload} isLoading={isLoading}>
            {isLoading ? t("LOADING") : t("SEND")}
          </Button>
        </div>
      )}

      {/* Вывод ответа от сервера */}
      {responseText && (
        <div className="w-full mt-4 p-3 border rounded bg-gray-50 text-left">
          <pre className="whitespace-pre-wrap break-words text-sm">
            {responseText}
          </pre>

          {/* Save and Copy buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              color="primary"
              onClick={saveAsTxt}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            >
              Save as TXT
            </Button>

            <Button
              size="sm"
              color="secondary"
              onClick={copyToClipboard}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              }
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      <h1 className="text-[#282151]">{t("TITLE")}</h1>
    </div>
  );
};
