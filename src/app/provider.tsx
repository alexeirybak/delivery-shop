"use client";

import { makeStore } from "@/store/redux";
import { Provider } from "react-redux";

const store = makeStore();

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
