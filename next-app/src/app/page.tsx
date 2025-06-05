import HeavyTaskForm from "@/components/HeavyTaskForm";
import SSEViewer from "../components/SSEViewer";
import BullTaskForm from "../components/BullTaskForm";

export default function Home() {
  return (
  <>
  <div>
    <SSEViewer/>
    <HeavyTaskForm/>
    <BullTaskForm/>
  </div>
  </>
  );
}
