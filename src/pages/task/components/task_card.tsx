import { Button, Card, Flex, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const COLOR_BY_STATUS: Record<string, string> = {
  TODO: "#e6fffb",
  IN_PROGRESS: "#fff7e6",
  DONE: "#f6ffed",
};

interface TaskCardProps {
  task: any;
  currentUserId?: string;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
  onStatusChange: (task: any, status: string) => void;
}

const TaskCard = ({
  task,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const isOwner = currentUserId === task.createdBy;

  return (
    <Card
      key={task.id}
      style={{
        marginBottom: 10,
        backgroundColor: COLOR_BY_STATUS[task.status],
      }}
      title={
        <Flex align="center" justify="space-between">
          <p>{task.title}</p>
          {isOwner && (
            <Flex gap={8}>
              {task.status !== "DONE" && (
                <Tooltip title="Edit Task">
                  <Button
                    type="text"
                    onClick={() => onEdit(task)}
                    icon={<EditOutlined />}
                  />
                </Tooltip>
              )}
              <Tooltip title="Delete Task">
                <Button
                  type="text"
                  danger
                  onClick={() => onDelete(task)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Flex>
          )}
        </Flex>
      }
    >
      {task.description && (
        <p style={{ marginBottom: 12, color: "#666" }}>{task.description}</p>
      )}
      <Flex style={{ gap: 8, flexWrap: "wrap" }}>
        {task.status === "TODO" && (
          <Button onClick={() => onStatusChange(task, "IN_PROGRESS")}>
            Start
          </Button>
        )}
        {task.status !== "DONE" && (
          <>
            {task.status === "IN_PROGRESS" && (
              <Button onClick={() => onStatusChange(task, "TODO")}>Back</Button>
            )}
            <Button onClick={() => onStatusChange(task, "DONE")}>Done</Button>
          </>
        )}
      </Flex>
    </Card>
  );
};

export default TaskCard;
