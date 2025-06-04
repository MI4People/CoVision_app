export type AppState =
  | "identifying"
  | "waitingForResults"
  | "resultPositive"
  | "resultNegative"
  | "error";

export class AppStateMachine {
  constructor(
    public state: AppState = "identifying",
    private stateEnteredListeners: Map<AppState, () => void> = new Map(),
  ) {
    this.state = state;
  }

  identified() {
    if (this.state !== "identifying") {
      return this.clone();
    }

    this.setState("waitingForResults");
    return this.clone();
  }

  positive() {
    if (this.state !== "waitingForResults") {
      return this.clone();
    }
    this.setState("resultPositive");
    return this.clone();
  }

  negative() {
    if (this.state !== "waitingForResults") {
      return this.clone();
    }
    this.setState("resultNegative");
    return this.clone();
  }

  error() {
    if (this.state !== "waitingForResults") {
      return this.clone();
    }
    this.setState("error");
    return this.clone();
  }

  reset() {
    if (this.state === "identifying") {
      return this.clone();
    }

    this.setState("identifying");
    return this.clone();
  }

  setListener(state: AppState, listener: () => void) {
    this.stateEnteredListeners.set(state, listener);
    if (state === this.state) {
      listener();
    }
  }

  private setState(state: AppState) {
    this.state = state;
    this.stateEnteredListeners.get(state)?.();
  }

  private clone() {
    return new AppStateMachine(this.state, this.stateEnteredListeners);
  }
}
