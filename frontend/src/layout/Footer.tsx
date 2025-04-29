import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("HEADER");
  return (
    <footer className="w-full h-[50px] bg-[#292150] text-white flex items-center px-10">
      <h1 className="sm:text-[10px]">© 2025 {t("TEXT")}</h1>
    </footer>
  );
};
