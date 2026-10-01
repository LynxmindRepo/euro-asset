import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Localized } from "@/components/ui/localized";
import { LanguageRestorer } from "@/features/preferences/language-context";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LanguageRestorer />
      <Header />
      <main><Localized>{children}</Localized></main>
      <Footer />
    </>
  );
}
