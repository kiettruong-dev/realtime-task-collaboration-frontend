/* eslint-disable react-hooks/set-state-in-effect */
import { useUpdateTask } from "@/hooks";
import { Input, Modal } from "antd";
import { useEffect, useState } from "react";

const EditTaskModal = ({ task, onClose }: any) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description || "");
    }
  }, [task]);

  const handleSave = () => {
    updateTask({
      taskId: task.id,
      title,
      description: desc,
      version: task.version,
    });
    onClose();
  };

  return (
    <Modal open={!!task} onCancel={onClose} onOk={handleSave}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Description</label>
        <Input.TextArea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          maxLength={255}
          showCount
        />
      </div>
    </Modal>
  );
};

export default EditTaskModal;
