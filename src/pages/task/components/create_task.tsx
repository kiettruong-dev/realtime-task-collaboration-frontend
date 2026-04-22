import { useCreateTask } from "@/hooks";
import { Button, Input } from "antd";
import { useState } from "react";

const CreateTask = ({ workspaceId }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createTask } = useCreateTask();

  const handleCreate = () => {
    createTask({ workspaceId, title, description: description });
    setTitle("");
    setDescription("");
  };

  return (
    <>
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
    </>
  );
};

export default CreateTask;
