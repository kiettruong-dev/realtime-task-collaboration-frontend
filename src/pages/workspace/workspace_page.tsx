import { useWorkspaces } from "@/hooks/useWorkspace";
import { Button, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "./modals/create_workspace_modal";
import { useState } from "react";
import InviteModal from "./modals/invite_modal";
import { useAuth } from "@/hooks";

const WorkspacePage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null,
  );
  const { data, isLoading, params, setParams } = useWorkspaces();
  const { user } = useAuth();
  console.log(user);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (owner: any) => owner.email,
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/workspace/${record.id}`)}>
            Open
          </Button>
          {record.owner.id === user?.id && (
            <Button
              onClick={() => {
                setSelectedWorkspace(record.id);
                setOpenInvite(true);
              }}
            >
              Invite
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => setOpenCreate(true)}>Thêm Workspace</Button>
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data?.workspaces || []}
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: data?.total || 0,
          onChange: (page, pageSize) => {
            setParams({ page, pageSize });
          },
        }}
      />
      <CreateWorkspaceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <InviteModal
        open={openInvite}
        workspaceId={selectedWorkspace!}
        onClose={() => setOpenInvite(false)}
      />
    </div>
  );
};

export default WorkspacePage;
