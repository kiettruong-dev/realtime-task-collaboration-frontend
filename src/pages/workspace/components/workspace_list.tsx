import { useAuth } from "@/hooks";
import { useWorkspaces } from "@/hooks/useWorkspace";
import { Button, Space, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteModal from "../modals/invite_modal";

const WorkspaceList = () => {
  const [openInvite, setOpenInvite] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null,
  );
  const { data, isLoading, params, setParams } = useWorkspaces();
  const { user } = useAuth();

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
          <Button onClick={() => navigate(`/workspaces/${record.id}`)}>
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
    <>
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

      <InviteModal
        open={openInvite}
        workspaceId={selectedWorkspace!}
        onClose={() => setOpenInvite(false)}
      />
    </>
  );
};

export default WorkspaceList;
