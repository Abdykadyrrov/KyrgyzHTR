"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { COUNTRY } from "@/utils/constants";

export const Header = () => {
  const t = useTranslations("HEADER");
  const pathName = usePathname();
  const { replace } = useRouter();

  return (
    <header className="w-full h-[80px] bg-[#292150]">
      <div className="w-full h-full max-w-[1440px] flex items-center justify-between px-10 m-auto sm:px-5">
        <div className="w-fit h-full flex items-center justify-center gap-4">
          <Image
            className="w-[65px] h-[65px]"
            src="/icons/Logo.png"
            alt="ICON"
            width={65}
            height={65}
          />
          <h1 className="text-white font-semibold w-[100px] text-start sm:text-[10px] sm:w-fit">
            {t("TEXT")}
          </h1>
        </div>
        <div className="flex mr-8 space-x-10 select-none sm:space-x-2 sm:mr-0">
          {COUNTRY.map((item, index) => (
            <label
              key={index}
              className="flex items-center justify-center flex-grow cursor-pointer radio"
            >
              <input
                className="hidden peer"
                value={item.name}
                name="radio"
                type="radio"
                onChange={() => replace(item.path)}
                checked={item.path === pathName}
              />
              <span className="relative text-md text-white text-shadow-sm transition-all duration-300 after:opacity-0 peer-checked:after:opacity-100 peer-checked:after:transition-all peer-checked:after:duration-300 peer-checked:text-purple-500 peer-checked:after:content-[''] peer-checked:after:block peer-checked:after:w-1/2 peer-checked:after:h-0.5 peer-checked:after:bg-purple-400 peer-checked:after:rounded-md peer-checked:after:absolute peer-checked:after:right-0 peer-checked:after:-bottom-1 peer-checked:before:content-[''] peer-checked:before:block peer-checked:before:w-full peer-checked:before:h-0.5 peer-checked:before:bg-purple-500 before:opacity-0 peer-checked:before:opacity-100 peer-checked:before:transition-all peer-checked:before:duration-300 peer-checked:before:rounded-md peer-checked:before:absolute peer-checked:before:right-0 peer-checked:before:bottom-0 sm:text-[14px]">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </header>
  );
};
