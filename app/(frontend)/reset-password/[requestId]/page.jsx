import { userForgetToken } from "@/lib/functions";
import ResetPasswordClient from "./ResetPassword/ResetPasswordClient";

const Page = async ({ params }) => {
 const { requestId } = await params;
  if (!requestId) {
    return <ResetPasswordClient status="invalid" />;
  }

  const { user, error } = await userForgetToken(requestId);

  if (error || !user) {
    return <ResetPasswordClient status="invalid" />;
  }

  return <ResetPasswordClient status="valid" requestId={requestId} />;
};

export default Page;
