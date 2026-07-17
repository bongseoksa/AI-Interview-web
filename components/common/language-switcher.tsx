"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = () => {
    const newLocale = locale === "ko" ? "en" : "ko";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleSwitch}>
      {locale === "ko" ? "\u{1F1F0}\u{1F1F7} \u{D55C}\u{AD6D}\u{C5B4}" : "\u{1F1FA}\u{1F1F8} English"}
    </Button>
  );
}
