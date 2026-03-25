import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
