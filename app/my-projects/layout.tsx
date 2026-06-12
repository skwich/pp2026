import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./logoutButton";

export default async function MyProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <header className="w-full h-full min-h-[100px] bg-white flex justify-between items-center px-[150px]">
        <img src="/inpad_logo.svg" className="h-[22px]"/>
        <div className="text-[16px] font-normal flex">
          <p className="pr-[5px] border-r-2 ">
            {session?.user?.username || "Пользователь"}
          </p>
          <LogoutButton/>
        </div>
      </header>
      {children}
    </>
  );
}
