/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  Modal,
  Tag,
  Space,
  Tooltip,
  Flex,
} from "antd";
import {
  CloudSyncOutlined,
  AntCloudOutlined,
  AlertOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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

const TaskPage = () => {
  const { workspaceId } = useParams();

  const { data } = useTasks(workspaceId!);
  const isSocketConnected = useSocketStatus();

  const { user } = useAuth();
  const currentUserId = user?.id;

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [conflictTaskId, setConflictTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (data) setTasks(data);
  }, [data]);

  const handleBroadcastMessage = useCallback((message: any) => {
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
  }, []);

  useBroadcastChannel(`workspace:${workspaceId}`, handleBroadcastMessage);

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
  useTaskSocket(workspaceId!, {
    onCreate: handleTaskCreate,
    onUpdate: handleTaskUpdate,
    onDelete: handleTaskDelete,
    onConflict: (error: any) => {
      setConflictTaskId(error.taskId);
    },
  });

  const handleCreate = () => {
    createTask({
      workspaceId: workspaceId!,
      title,
      description: description || undefined,
    });
    setTitle("");
    setDescription("");
  };

  const handleUpdate = (task: any, status: string) => {
    updateTask({
      taskId: task.id,
      status,
      version: task.version,
    });
  };

  const handleDelete = (task: any) => {
    deleteTask({
      taskId: task.id,
      version: task.version,
    });
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = () => {
    const changes: any = { version: editingTask.version };
    if (editTitle !== editingTask.title) {
      changes.title = editTitle;
    }
    if (editDescription !== editingTask.description) {
      changes.description = editDescription || undefined;
    }

    if (Object.keys(changes).length > 1) {
      updateTask({
        taskId: editingTask.id,
        ...changes,
      });
    }
    setEditingTask(null);
  };

  const renderColumn = (status: string) => {
    const colorBackground: Record<string, string> = {
      TODO: "#e6fffb",
      IN_PROGRESS: "#fff7e6",
      DONE: "#f6ffed",
    };
    return tasks
      .filter((t) => t.status === status)
      .map((task) => (
        <Card
          key={task.id}
          style={{
            marginBottom: 10,
            backgroundColor: colorBackground[task.status],
          }}
          title={
            <Flex align="center" justify="space-between">
              <p>{task.title}</p>
              {currentUserId === task.createdBy && (
                <Flex gap={8}>
                  {task.status !== "DONE" && (
                    <Tooltip title="Edit Task">
                      <Button
                        type="text"
                        onClick={() => handleEditTask(task)}
                        icon={<EditOutlined size={24} />}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Task">
                    <Button
                      type="text"
                      danger
                      onClick={() => handleDelete(task)}
                      icon={<DeleteOutlined />}
                    />
                  </Tooltip>
                </Flex>
              )}
            </Flex>
          }
        >
          {task.description && (
            <p style={{ marginBottom: 12, color: "#666" }}>
              {task.description}
            </p>
          )}
          <Flex style={{ gap: 8, flexWrap: "wrap" }}>
            {status === "TODO" && (
              <Button onClick={() => handleUpdate(task, "IN_PROGRESS")}>
                Start
              </Button>
            )}
            {task.status !== "DONE" && (
              <>
                {task.status === "IN_PROGRESS" && (
                  <Button onClick={() => handleUpdate(task, "TODO")}>
                    Back
                  </Button>
                )}
                <Button onClick={() => handleUpdate(task, "DONE")}>Done</Button>
              </>
            )}
          </Flex>
        </Card>
      ));
  };

  return (
    <div style={{ padding: 20 }}>
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

      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input.TextArea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ marginBottom: 8 }}
        />
        <Button onClick={handleCreate}>Add Task</Button>
      </div>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <h3>TODO</h3>
          {renderColumn("TODO")}
        </Col>

        <Col span={8}>
          <h3>IN_PROGRESS</h3>
          {renderColumn("IN_PROGRESS")}
        </Col>

        <Col span={8}>
          <h3>DONE</h3>
          {renderColumn("DONE")}
        </Col>
      </Row>

      <Modal
        title="Edit Task"
        open={!!editingTask}
        onCancel={() => setEditingTask(null)}
        onOk={handleSaveEdit}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Title</label>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>
            Description
          </label>
          <Input.TextArea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>

      <Modal
        title={
          <Space>
            <AlertOutlined style={{ color: "#ff7a45" }} />
            <span>Conflict Detected</span>
          </Space>
        }
        open={!!conflictTaskId}
        onCancel={() => setConflictTaskId(null)}
        footer={[
          <Button
            key="refresh"
            type="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Tải lại trang
          </Button>,
        ]}
      >
        <p>
          Task này đã được chỉnh sửa bởi người khác. Vui lòng tải lại trang để
          xem phiên bản mới nhất.
        </p>
      </Modal>
    </div>
  );
};
export default TaskPage;
