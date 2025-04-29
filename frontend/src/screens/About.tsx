import { useTranslations } from "next-intl";

export const About = () => {
  const t = useTranslations("ABOUT");

  return (
    <section className="py-10">
      <h1 className="text-[#282151] font-bold text-5xl sm:text-2xl sm:text-center">
        {t("TEXT")}
      </h1>
    </section>
  );
};
