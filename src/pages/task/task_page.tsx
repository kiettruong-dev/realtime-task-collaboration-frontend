/* eslint-disable react-hooks/set-state-in-effect */

import { useLocation, useNavigate } from "react-router-dom";
import TaskBoard from "./components/task_board";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Flex } from "antd";

const TaskPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nameWorkspace = location.state?.workspace?.name || "Workspace";
  return (
    <div style={{ padding: 20 }}>
      <Flex align="center" gap={16} style={{ marginBottom: 20 }}>
        <ArrowLeftOutlined onClick={() => navigate(-1)} />
        <h2>Workspace: {nameWorkspace}</h2>
      </Flex>
      <TaskBoard />
    </div>
  );
};

export default TaskPage;
