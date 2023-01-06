import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../server/db";

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  let stripeSubscriptionStatus;
  await prisma.user
    .findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    })
    .then(
      (onResolved) => {
        stripeSubscriptionStatus = onResolved.stripeSubscriptionStatus;
        console.log("......................................");
      },
      (onRejected) => {
        // Some task on failure
      }
    );

  if (session && stripeSubscriptionStatus === "active") {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2));
    const { input } = req.body;
    console.log("input", input);
    res.status(200).json({ result: input });
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
