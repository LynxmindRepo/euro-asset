import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Localized } from "@/components/ui/localized";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main><Localized>{children}</Localized></main>
      <Footer />
    </>
  );
}
