"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { content, type Locale } from "@/data/content";
import { UNIVERSITY_ORDER, UNIVERSITY_UI } from "@/data/university-ui";
import { LANGUAGE_INSTITUTES } from "@/data/language-institutes";

type DropItem = { label: string; href: string; viewAll?: boolean };

type NavEntry =
  | { label: string; href: string; items?: never }
  | { label: string; href?: never; items: DropItem[] };

export function Header({ locale }: { locale: Locale }) {
  const t = content[locale].nav;
  const isAr = locale === "ar";
  const other = isAr ? "en" : "ar";
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveDropdown(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const universityItems: DropItem[] = [
    ...UNIVERSITY_ORDER
      .filter((slug) => slug !== "bright")
      .map((slug) => {
        const university = UNIVERSITY_UI[slug];
        return {
          label: isAr ? university.arabicName : university.name,
          href: `/${locale}/universities/${slug}`,
        };
      }),
    {
      label: isAr ? "البحث عن برنامج دراسي" : "Search programmes",
      href: `/${locale}/programmes`,
      viewAll: true,
    },
    {
      label: isAr ? "عرض كل الجامعات" : "View all universities",
      href: `/${locale}/universities`,
      viewAll: true,
    },
  ];

  const languageItems: DropItem[] = [
    ...LANGUAGE_INSTITUTES.map((institute) => ({
      label: isAr ? institute.arabicName : institute.name,
      href: `/${locale}/language-institutes/${institute.slug}`,
    })),
    {
      label: isAr ? "عرض كل معاهد اللغة" : "View all language institutes",
      href: `/${locale}/language-institutes`,
      viewAll: true,
    },
  ];


  const links: NavEntry[] = [
    { label: t.home, href: `/${locale}` },
    { label: t.universities, items: universityItems },
    { label: isAr ? "معاهد اللغة" : "Language Institutes", items: languageItems },
    { label: t.services, href: `/${locale}#services` },
    { label: t.about, href: `/${locale}#about` },
    { label: t.contact, href: `/${locale}#contact` },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-40" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-3 text-white">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-black">
            <Image src="/yaz-logo.png" alt="YAZ Education" fill priority className="object-cover" />
          </div>
          <div className="hidden leading-none sm:block">
            <div className="text-[18px] font-extrabold tracking-tight">YAZ</div>
            <div className="mt-1 text-[10px] font-semibold tracking-[.13em] text-white/75">EDUCATION</div>
          </div>
        </Link>

        <nav ref={navRef} className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {links.map((entry, index) => {
            if (entry.items) {
              const isOpen = activeDropdown === entry.label;
              return (
                <div
                  key={entry.label}
                  className={`nav-dropdown ${isOpen ? "nav-dropdown-active" : ""}`}
                >
                  <button
                    type="button"
                    className="nav-link nav-dropdown-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setActiveDropdown(isOpen ? null : entry.label)}
                    aria-haspopup="menu"
                  >
                    {entry.label}
                    <ChevronDown size={15} className={`nav-chevron ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className={`nav-dropdown-menu ${entry.label === t.universities ? "nav-dropdown-menu-mega" : ""} ${isOpen ? "nav-dropdown-menu-open" : ""}`}
                    role="menu"
                  >
                    {entry.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`nav-dropdown-item ${item.viewAll ? "nav-dropdown-view-all" : ""}`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link key={entry.href} href={entry.href} className={`nav-link ${index === 0 ? "nav-link-active" : ""}`}>
                {entry.label}
              </Link>
            );
          })}
          <Link href={`/${locale}/programmes`} className="nav-icon" aria-label={isAr ? "البحث عن برنامج" : "Search programmes"}>
            <Search size={19} />
          </Link>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href={`/${other}`} className="text-sm font-semibold text-blue-200 transition hover:text-white">
            {t.language}
          </Link>
          <span className="h-4 w-px bg-white/25" />
          <span className="text-sm font-semibold text-white">{isAr ? "العربية" : "English"}</span>
          <Link href={`/${locale}#consultation`} className="header-cta">
            {t.consult} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <button type="button" className="nav-icon lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-[#06111f]/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <nav className="grid gap-1">
            {links.map((entry) =>
              entry.items ? (
                <details key={entry.label} className="mobile-nav-group">
                  <summary>{entry.label}<ChevronDown size={16} /></summary>
                  <div className="mobile-nav-submenu">
                    {entry.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={item.viewAll ? "mobile-nav-view-all" : undefined}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={entry.href} href={entry.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/8 hover:text-white">
                  {entry.label}
                </Link>
              )
            )}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href={`/${other}`} className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white">{t.language}</Link>
              <Link href={`/${locale}#consultation`} className="rounded-xl bg-brand-blue px-4 py-3 text-center text-sm font-bold text-white">{t.consult}</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
