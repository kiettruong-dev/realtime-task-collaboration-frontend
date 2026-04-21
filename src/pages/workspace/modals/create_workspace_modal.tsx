import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { Form, Input, Modal } from "antd";

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}
const CreateWorkspaceModal = ({ open, onClose }: CreateWorkspaceModalProps) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateWorkspace();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate(values, {
        onSuccess: () => {
          form.resetFields();
          onClose();
        },
      });
    });
  };

  return (
    <Modal
      open={open}
      title="Tạo Workspace"
      onOk={handleSubmit}
      confirmLoading={isPending}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên workspace"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập tên workspace..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
