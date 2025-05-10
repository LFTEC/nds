import MainLayout from "@/ui/main/main-layout";
import { auth } from "@/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <MainLayout user={session?.user ?? {username: "init user"}}>
      {children}
    </MainLayout>
  );
}
