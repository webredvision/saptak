export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import SignInClient from "./signIn/SignInClient";

const SignIn = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <SignInClient />;
};

export default SignIn;
