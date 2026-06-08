'use client';

import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {

    async function handleLogout() {
        await authClient.signOut();
        window.location.href = "/sign-in";
    }

    return (
        <button onClick={handleLogout} className="ml-[5px] hover:cursor-pointer">Выйти</button>
    );
}