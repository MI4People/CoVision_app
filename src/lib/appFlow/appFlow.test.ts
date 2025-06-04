import { act, renderHook } from "@testing-library/react";
import { AppState, AppStateMachine } from "./appFlow";
import { describe, expect, it, jest } from "@jest/globals";
import { useAppFlow } from "@/src/lib/appFlow/useAppFlow";
import { useState } from "react";

const useLocalAppStateMachine = () => useState(new AppStateMachine());

describe("AppStateMachine", () => {
  it("should initialize with default state", () => {
    const machine = new AppStateMachine();
    expect(machine.state).toBe("identifying");
  });

  it("should transition to waitingForResults on identified()", () => {
    const machine = new AppStateMachine();
    const next = machine.identified();
    expect(next.state).toBe("waitingForResults");
  });

  it("should transition to error on error()", () => {
    const machine = new AppStateMachine().identified();
    const next = machine.error();
    expect(next.state).toBe("error");
  });

  it("should transition to resultPositive on positive()", () => {
    const machine = new AppStateMachine().identified();
    const next = machine.positive();
    expect(next.state).toBe("resultPositive");
  });

  it("should transition to resultNegative on negative()", () => {
    const machine = new AppStateMachine().identified();
    const next = machine.negative();
    expect(next.state).toBe("resultNegative");
  });

  it("should call listener when entering state", () => {
    const machine = new AppStateMachine();
    const listener = jest.fn();
    machine.setListener("waitingForResults", listener);
    machine.identified();
    expect(listener).toHaveBeenCalled();
  });

  it("clone should preserve state and listeners", () => {
    const machine = new AppStateMachine().identified();
    const listener = jest.fn();
    machine.setListener("resultPositive", listener);
    const clone = machine.positive();
    expect(clone.state).toBe("resultPositive");
    // Trigger listener again to ensure it's preserved
    clone.positive();
    expect(listener).toHaveBeenCalled();
  });

  it("should call listeners for all states", () => {
    let machine = new AppStateMachine();
    const states: AppState[] = [
      "identifying",
      "waitingForResults",
      "resultPositive",
      "resultNegative",
      "error",
    ];
    const listeners: Record<string, jest.Mock> = {};
    states.forEach((state) => {
      listeners[state] = jest.fn();
      machine.setListener(state, listeners[state]);
    });

    expect(listeners["identifying"]).toHaveBeenCalledTimes(1);

    machine = machine.identified();
    expect(listeners["waitingForResults"]).toHaveBeenCalledTimes(1);

    machine = machine.positive();
    expect(listeners["resultPositive"]).toHaveBeenCalledTimes(1);

    machine = machine.reset();
    expect(listeners["identifying"]).toHaveBeenCalledTimes(2);
    machine = machine.identified();
    expect(listeners["waitingForResults"]).toHaveBeenCalledTimes(2);

    machine = machine.negative();
    expect(listeners["resultNegative"]).toHaveBeenCalledTimes(1);

    machine = machine.reset();
    expect(listeners["identifying"]).toHaveBeenCalledTimes(3);
    machine = machine.identified();
    expect(listeners["waitingForResults"]).toHaveBeenCalledTimes(3);

    machine = machine.error();
    expect(listeners["error"]).toHaveBeenCalledTimes(1);
  });
});

describe("useAppFlow", () => {
  it("should initialize with identifying state", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    expect(result.current.state).toBe("identifying");
  });

  it("should transition state with identified()", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    act(() => {
      result.current.identified();
    });
    expect(result.current.state).toBe("waitingForResults");
  });

  it("should transition state with error()", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    act(() => {
      result.current.identified();
      result.current.error();
    });
    expect(result.current.state).toBe("error");
  });

  it("should transition state with positive()", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    act(() => {
      result.current.identified();
      result.current.positive();
    });
    expect(result.current.state).toBe("resultPositive");
  });

  it("should transition state with negative()", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    act(() => {
      result.current.identified();
      result.current.negative();
    });
    expect(result.current.state).toBe("resultNegative");
  });

  it("should call listener when setListener is used", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    const listener = jest.fn();
    act(() => {
      result.current.identified();
      result.current.setListener("resultPositive", listener);
      result.current.positive();
    });
    expect(listener).toHaveBeenCalled();
  });

  it("should reset state with identifying()", () => {
    const { result } = renderHook(() => useAppFlow(useLocalAppStateMachine));
    act(() => {
      result.current.identified();
      result.current.positive();
      result.current.reset();
    });
    expect(result.current.state).toBe("identifying");
  });
});
