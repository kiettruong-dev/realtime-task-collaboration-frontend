import { AlertOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";

const ConflictModal = ({ conflictTaskId, onClose }: any) => {
  return (
    <Modal
      title={
        <Space>
          <AlertOutlined style={{ color: "#ff7a45" }} />
          <span>Conflict Detected</span>
        </Space>
      }
      open={!!conflictTaskId}
      onCancel={onClose}
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
      Task này đã được chỉnh sửa bởi người khác. Vui lòng tải lại trang để xem
      phiên bản mới nhất.
    </Modal>
  );
};

export default ConflictModal;
