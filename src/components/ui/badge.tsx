import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

const colors = {
  red: "bg-red-500/15 text-red-700 group-data-hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-hover:bg-red-500/20",
  orange:
    "bg-orange-500/15 text-orange-700 group-data-hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:group-data-hover:bg-orange-500/20",
  amber:
    "bg-amber-400/20 text-amber-700 group-data-hover:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-data-hover:bg-amber-400/15",
  yellow:
    "bg-yellow-400/20 text-yellow-700 group-data-hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-hover:bg-yellow-400/15",
  lime: "bg-lime-400/20 text-lime-700 group-data-hover:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-hover:bg-lime-400/15",
  green:
    "bg-green-500/15 text-green-700 group-data-hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-hover:bg-green-500/20",
  emerald:
    "bg-emerald-500/15 text-emerald-700 group-data-hover:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-data-hover:bg-emerald-500/20",
  teal: "bg-teal-500/15 text-teal-700 group-data-hover:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-data-hover:bg-teal-500/20",
  cyan: "bg-cyan-400/20 text-cyan-700 group-data-hover:bg-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-data-hover:bg-cyan-400/15",
  sky: "bg-sky-500/15 text-sky-700 group-data-hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-hover:bg-sky-500/20",
  blue: "bg-blue-500/15 text-blue-700 group-data-hover:bg-blue-500/25 dark:text-blue-400 dark:group-data-hover:bg-blue-500/25",
  indigo:
    "bg-indigo-500/15 text-indigo-700 group-data-hover:bg-indigo-500/25 dark:text-indigo-400 dark:group-data-hover:bg-indigo-500/20",
  violet:
    "bg-violet-500/15 text-violet-700 group-data-hover:bg-violet-500/25 dark:text-violet-400 dark:group-data-hover:bg-violet-500/20",
  purple:
    "bg-purple-500/15 text-purple-700 group-data-hover:bg-purple-500/25 dark:text-purple-400 dark:group-data-hover:bg-purple-500/20",
  fuchsia:
    "bg-fuchsia-400/15 text-fuchsia-700 group-data-hover:bg-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:group-data-hover:bg-fuchsia-400/20",
  pink: "bg-pink-400/15 text-pink-700 group-data-hover:bg-pink-400/25 dark:bg-pink-400/10 dark:text-pink-400 dark:group-data-hover:bg-pink-400/20",
  rose: "bg-rose-400/15 text-rose-700 group-data-hover:bg-rose-400/25 dark:bg-rose-400/10 dark:text-rose-400 dark:group-data-hover:bg-rose-400/20",
  zinc: "bg-zinc-600/10 text-zinc-700 group-data-hover:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-hover:bg-white/10",
};

type BadgeProps = { color?: keyof typeof colors };

export function Badge({
  color = "zinc",
  className,
  ...props
}: BadgeProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
        colors[color],
      )}
    />
  );
}

export const BadgeButton = forwardRef(function BadgeButton(
  {
    color = "zinc",
    className,
    children,
    ...props
  }: BadgeProps & { className?: string; children: React.ReactNode } & (
      | Omit<Headless.ButtonProps, "as" | "className">
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    ),
  ref: React.ForwardedRef<HTMLElement>,
) {
  let classes = clsx(
    className,
    "group relative inline-flex rounded-md focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </Headless.Button>
  );
});

export function OrderStatusBadge({ orderStatus }) {
  if (orderStatus === "PENDING") {
    return <Badge color="orange">결제대기</Badge>;
  }

  if (orderStatus === "ORDERED") {
    return <Badge color="emerald">주문완료</Badge>;
  }

  if (orderStatus === "CANCELREQUESTED") {
    return <Badge color="yellow">취소요청</Badge>;
  }

  if (orderStatus === "CANCELED") {
    return <Badge color="red">취소완료</Badge>;
  }
}

export function DeliveryStatusBadge({ deliveryStatus }) {
  if (deliveryStatus === "PENDING") {
    return <Badge color="sky">출고대기</Badge>;
  }

  if (deliveryStatus === "WAITING") {
    return <Badge color="blue">배송대기</Badge>;
  }

  if (deliveryStatus === "DELIVERING") {
    return <Badge color="cyan">배송중</Badge>;
  }

  if (deliveryStatus === "DELIVERED") {
    return <Badge color="green">배송완료</Badge>;
  }

  if (deliveryStatus === "CANCELED") {
    return <Badge color="yellow">배송취소</Badge>;
  }

  if (deliveryStatus === "FAILED") {
    return <Badge color="red">배송실패</Badge>;
  }
}

export function DeliveryReceivingTimeBadge({ receivingTime }) {
  if (receivingTime === "QUICK") {
    return <Badge color="orange">QUICK</Badge>;
  }

  if (receivingTime === "MORNING") {
    return <Badge color="green">MORNING</Badge>;
  }

  if (receivingTime === "AFTERNOON") {
    return <Badge color="lime">AFTERNOON</Badge>;
  }

  if (receivingTime === "EVENING") {
    return <Badge color="yellow">EVENING</Badge>;
  }
}

export function QuickTaskBadge({ deliveryStatus }) {
  if (deliveryStatus === "PENDING") {
    return <Badge color="sky">출고대기</Badge>;
  }

  if (deliveryStatus === "RECEIPTED") {
    return <Badge color="blue">배송대기</Badge>;
  }

  if (deliveryStatus === "DELIVERING") {
    return <Badge color="cyan">배송중</Badge>;
  }

  if (deliveryStatus === "DELIVERED") {
    return <Badge color="green">배송완료</Badge>;
  }

  if (deliveryStatus === "CANCELED") {
    return <Badge color="yellow">배송취소</Badge>;
  }

  if (deliveryStatus === "REQUESTED") {
    return <Badge color="blue">요청됨</Badge>;
  }

  if (deliveryStatus === "ASSIGNED") {
    return <Badge color="blue">배정됨</Badge>;
  }
  if (deliveryStatus === "REQUEST_FAILED") {
    return <Badge color="red">요청 실패</Badge>;
  }
}
