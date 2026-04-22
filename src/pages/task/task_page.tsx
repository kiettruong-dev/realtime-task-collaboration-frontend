/* eslint-disable react-hooks/set-state-in-effect */

import { useParams } from "react-router-dom";
import TaskBoard from "./components/task_board";

const TaskPage = () => {
  const { workspaceId } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>Workspace: {workspaceId}</h2>
      <TaskBoard />
    </div>
  );
};

export default TaskPage;
