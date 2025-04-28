import { AppStateMachine } from "@/src/lib/appFlow/appFlow";
import { atom, useAtom } from "jotai";

const appState = atom<AppStateMachine>(new AppStateMachine());

type UseAppStateMachine = () => [
  AppStateMachine,
  (stateMachine: AppStateMachine) => void,
];

const useGlobalAppStateMachine: UseAppStateMachine = () => useAtom(appState);

export const useAppFlow = (useStateMachine = useGlobalAppStateMachine) => {
  const [stateMachine, setStateMachine] = useStateMachine();

  return {
    state: stateMachine.state,
    identified: () => setStateMachine(stateMachine.identified()),
    positive: () => setStateMachine(stateMachine.positive()),
    negative: () => setStateMachine(stateMachine.negative()),
    error: () => setStateMachine(stateMachine.error()),
    setListener: stateMachine.setListener.bind(stateMachine),
  };
};
