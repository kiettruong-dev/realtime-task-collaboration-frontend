import TaskCard from "./task_card";

interface TaskColumnProps {
  status: string;
  tasks: any[];
  currentUserId?: string;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
  onStatusChange: (task: any, status: string) => void;
}

const COLUMN_LABELS: Record<string, string> = {
  TODO: "TODO",
  IN_PROGRESS: "IN PROGRESS",
  DONE: "DONE",
};

const TaskColumn = ({
  status,
  tasks,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskColumnProps) => {
  const filtered = tasks.filter((t) => t.status === status);

  return (
    <div>
      <h3>{COLUMN_LABELS[status]}</h3>
      {filtered.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
