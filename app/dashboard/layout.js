import { auth } from "@/auth";
import Footer from "@/components/dashboardUI/Footer";
import NavBar from "@/components/dashboardUI/NavBar";
import { GuestProvider } from "@/context/guestContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;

  if (!session && !guestId) {
    redirect("/");
  }
  return (
    <>
      <GuestProvider>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </GuestProvider>
    </>
  );
}
