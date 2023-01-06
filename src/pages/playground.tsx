import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Component() {
  const { data: session } = useSession();
  const { data: subscriptionStatus, isLoading } =
    api.user.subscriptionStatus.useQuery();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.length < 30) setError(false);
  }, [input]);

  const submit = async () => {
    // Check if character limit is exceeded
    if (input.length > 30) return setError(true);

    // Set loading state
    setLoading(true);

    try {
      const res = await fetch("/api/get-session-example", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const suggestion: { result: string } = await res.json();
      const { result } = suggestion;
      console.log("result", result);

      setSuggestion(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (session && subscriptionStatus === "active") {
    return (
      <>
        <p>Go</p>

        <div className="mx-auto max-w-7xl py-12">
          <h2 className="font-b old  pb-2 text-center text-2xl">
            Marketing Copy Generator
          </h2>
          {/* Input field for marketing copy */}
          <div className="mx-auto flex w-1/3 flex-col justify-center gap-4">
            <div className="relative w-full">
              {/* Error message */}
              {error && (
                <p className="pt-1 text-xs text-red-500">
                  Character limit exceeded, please enter less text
                </p>
              )}
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full resize-none rounded-lg border-2 border-gray-300 bg-white p-4 text-sm focus:outline-none"
                placeholder="Enter your topic here"
              />
              {/* Character limit in bottom right of textarea */}
              <div
                className={`absolute ${
                  input.length > 30 ? "text-red-500" : "text-gray-400"
                } bottom-2 right-2 text-xs`}
              >
                <span>{input.length}</span>/30
              </div>
            </div>
            <button
              type="button"
              onClick={submit}
              className="h-12 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-4">
                  <p>Loading...</p>
                </div>
              ) : (
                "Generate"
              )}
            </button>

            {/* Output field for marketing copy */}
            {suggestion && (
              <div className="mt-8">
                <h4 className="pb-2 text-lg font-semibold">
                  Your marketing copy:
                </h4>
                <div className="relative w-full rounded-md bg-gray-100 p-4">
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  if (session && subscriptionStatus != "active") {
    router.push("/dashboard");
  }

  return <></>;
}
