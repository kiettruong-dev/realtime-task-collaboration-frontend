/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Tag, Tooltip } from "antd";
import { CloudSyncOutlined, AntCloudOutlined } from "@ant-design/icons";

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTask";
import { useTaskSocket } from "@/hooks/useTaskSocket";
import { useAuth } from "@/hooks/useAuth";
import { useSocketStatus } from "@/hooks/useSocketStatus";
import {
  useBroadcastChannel,
  sendBroadcastMessage,
} from "@/hooks/useBroadcastChannel";
import CreateTask from "./create_task";
import TaskColumn from "./task_column";
import EditTaskModal from "../modals/edit_task_modal";
import ConflictModal from "../modals/conflict_task_modal";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const TaskBoard = () => {
  const { workspaceId } = useParams();

  const { data } = useTasks(workspaceId!);
  const isSocketConnected = useSocketStatus();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [conflictTaskId, setConflictTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (data) setTasks(data);
  }, [data]);

  // ─── Broadcast handlers ───────────────────────────────────────────────────

  const handleTaskCreate = useCallback(
    (task: any, fromBroadcast = false) => {
      setTasks((prev) => {
        if (prev.some((t) => t.id === task.id)) return prev;
        return [task, ...prev];
      });
      if (!fromBroadcast) {
        sendBroadcastMessage(`workspace:${workspaceId}`, {
          type: "task_created",
          data: task,
        });
      }
    },
    [workspaceId],
  );

  const handleTaskUpdate = useCallback(
    (task: any, fromBroadcast = false) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      if (!fromBroadcast) {
        sendBroadcastMessage(`workspace:${workspaceId}`, {
          type: "task_updated",
          data: task,
        });
      }
    },
    [workspaceId],
  );

  const handleTaskDelete = useCallback(
    (taskId: string, fromBroadcast = false) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (!fromBroadcast) {
        sendBroadcastMessage(`workspace:${workspaceId}`, {
          type: "task_deleted",
          data: taskId,
        });
      }
    },
    [workspaceId],
  );

  const handleBroadcastMessage = useCallback(
    (message: any) => {
      switch (message.type) {
        case "task_created":
          handleTaskCreate(message.data, true);
          break;
        case "task_updated":
          handleTaskUpdate(message.data, true);
          break;
        case "task_deleted":
          handleTaskDelete(message.data, true);
          break;
        case "logout":
          window.location.reload();
          break;
      }
    },
    [handleTaskCreate, handleTaskUpdate, handleTaskDelete],
  );

  useBroadcastChannel(`workspace:${workspaceId}`, handleBroadcastMessage);

  useTaskSocket(workspaceId!, {
    onCreate: handleTaskCreate,
    onUpdate: handleTaskUpdate,
    onDelete: handleTaskDelete,
    onConflict: (error: any) => setConflictTaskId(error.taskId),
  });

  const handleCreate = (title: string, description?: string) => {
    createTask({ workspaceId: workspaceId!, title, description });
  };

  const handleStatusChange = (task: any, status: string) => {
    updateTask({ taskId: task.id, status, version: task.version });
  };

  const handleDelete = (task: any) => {
    deleteTask({ taskId: task.id, version: task.version });
  };

  const handleSaveEdit = (taskId: string, changes: Record<string, any>) => {
    updateTask({ taskId, ...changes, version: editingTask.version });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>Task Board</h2>
        <Tooltip title={isSocketConnected ? "Kết nối tốt" : "Mất kết nối"}>
          <Tag
            icon={
              isSocketConnected ? <CloudSyncOutlined /> : <AntCloudOutlined />
            }
            color={isSocketConnected ? "green" : "red"}
          >
            {isSocketConnected ? "Connected" : "Disconnected"}
          </Tag>
        </Tooltip>
      </div>

      <CreateTask onSubmit={handleCreate} />

      <Row gutter={16} style={{ marginTop: 20 }}>
        {STATUSES.map((status) => (
          <Col span={8} key={status}>
            <TaskColumn
              status={status}
              tasks={tasks}
              currentUserId={currentUserId}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </Col>
        ))}
      </Row>

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
      <ConflictModal
        open={!!conflictTaskId}
        onClose={() => setConflictTaskId(null)}
      />
    </>
  );
};

export default TaskBoard;
