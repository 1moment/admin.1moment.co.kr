/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import React from "react";
import * as Headless from "@headlessui/react";
import { Link as RL, type LinkProps } from "react-router";

export function Link(props: LinkProps) {
  return (
    <Headless.DataInteractive>
      <RL {...props} />
    </Headless.DataInteractive>
  );
}
