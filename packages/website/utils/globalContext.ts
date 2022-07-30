import React from "react";
export interface GlobalState {
  theme: "auto" | "dark" | "light";
  viewer: number;
  visited: number;
}

export const GlobalContext = React.createContext<{
  state: GlobalState;
  setState: (newState: GlobalState) => void;
}>({
  state: {
    theme: "auto",
    viewer: 0,
    visited: 0,
  },
  setState: (newState: GlobalState) => {},
});
