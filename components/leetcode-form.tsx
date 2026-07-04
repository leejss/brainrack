"use client";

import { useActionState } from "react";
import { createExplanationAction } from "@/app/e/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const initialState = {
  message: "",
};

export default function LeetcodeForm() {
  const [state, formAction, isPending] = useActionState(
    createExplanationAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid w-full gap-4">
      <Input
        name="url"
        placeholder="Enter Leetcode URL (https://leetcode.com/problems/...)"
        required
      />

      <Textarea
        name="content"
        placeholder="Paste the problem statement as plain text"
        required
      />

      {state.message ? <p aria-live="polite">{state.message}</p> : null}

      <Button type="submit" disabled={isPending}>
        Submit
      </Button>
    </form>
  );
}
