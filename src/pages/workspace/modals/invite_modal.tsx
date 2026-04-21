import { Modal, Input, Form } from "antd";
import { useInviteWorkspace } from "@/hooks/useWorkspace";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
}
const InviteModal = ({ open, onClose, workspaceId }: InviteModalProps) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useInviteWorkspace(workspaceId);

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
      title="Mời thành viên vào workspace"
      onOk={handleSubmit}
      confirmLoading={isPending}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email thành viên"
          rules={[
            { required: true },
            { type: "email", message: "Vui lòng nhập email hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default InviteModal;
