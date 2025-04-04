import * as React from "react";
import * as Sentry from "@sentry/react";
// Canvas is already in use. Chart with ID '0' must be destroyed before the canvas with ID '' can be reused.
import "chart.js/auto";

import { Line } from "react-chartjs-2";
import { Link } from "@/components/ui/link.tsx";

import {
    useDashboard, useDashboardOrderAmount,
    useDashboardOrderCount,
} from "@/hooks/use-dashboard.tsx";
import { format } from "date-fns/format";
import { subDays } from "date-fns/subDays";

const currentDate = new Date();
function Home() {
  return (
    <div>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense>
          <Summary />
        </React.Suspense>
      </Sentry.ErrorBoundary>

      <div className="mt-4 grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
        <Sentry.ErrorBoundary
          fallback={({ error, componentStack }) => {
            console.error(error, componentStack);
            return <p>{(error as Error).message}</p>;
          }}
        >
          <React.Suspense>
            <OrderCountGraph />
          </React.Suspense>
        </Sentry.ErrorBoundary>

        <Sentry.ErrorBoundary
          fallback={({ error, componentStack }) => {
            console.error(error, componentStack);
            return <p>{(error as Error).message}</p>;
          }}
        >
          <React.Suspense>
            <OrderAmountGraph />
          </React.Suspense>
        </Sentry.ErrorBoundary>
      </div>
    </div>
  );
}

function Summary() {
  const { data } = useDashboard();
  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div className="p-4 bg-white rounded-xl">
        <p className="text-lg/6 font-medium sm:text-sm/6">신규 주문</p>
        <p className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
          {data.newOrdersCount.toLocaleString("ko-KR")}건
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <p className="text-lg/6 font-medium sm:text-sm/6">배송전</p>
        <p className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
          <Link to="/orders?deliveryStatus=WAITING">
            {data.preparingOrdersCount.toLocaleString("ko-KR")}건
          </Link>
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <p className="text-lg/6 font-medium sm:text-sm/6">배송중</p>
        <p className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
          {data.shippedOrdersCount.toLocaleString("ko-KR")}건
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <p className="text-lg/6 font-medium sm:text-sm/6">취소요청</p>
        <p className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
          <Link to="/orders?status=CANCELREQUESTED">
            {data.cancelRequestedOrdersCount.toLocaleString("ko-KR")}건
          </Link>
        </p>
      </div>
    </div>
  );
}

function OrderCountGraph() {
  const ref = React.useRef();
  const { data } = useDashboardOrderCount({
    startDate: format(subDays(currentDate, 14), "yyyy-MM-dd"),
    endDate: format(currentDate, "yyyy-MM-dd"),
  });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Line ref={ref} data={data.data} />
    </div>
  );
}

function OrderAmountGraph() {
  const ref = React.useRef();
  const { data } = useDashboardOrderAmount({
    startDate: format(subDays(currentDate, 14), "yyyy-MM-dd"),
    endDate: format(currentDate, "yyyy-MM-dd"),
  });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Line ref={ref} data={data.data} />
    </div>
  );
}

export default function HomePage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense>
          <Home />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
