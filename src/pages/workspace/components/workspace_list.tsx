import { useAuth } from "@/hooks";
import { useWorkspaces, useWorkspaceSocket } from "@/hooks/useWorkspace";
import { Button, Space, Table, notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteModal from "../modals/invite_modal";
import { useQueryClient } from "@tanstack/react-query";
import { KEY_QUERY } from "@/constants";

const WorkspaceList = () => {
  const [openInvite, setOpenInvite] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null,
  );

  const { data, isLoading, params, setParams } = useWorkspaces();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useWorkspaceSocket(params, (workspace: any) => {
    notification.success({
      message: "New workspace",
      description: `You were added to ${workspace.name}`,
    });

    queryClient.setQueryData(
      [KEY_QUERY.LIST_WORKSPACES, params],
      (old: any) => {
        if (!old) return old;

        const exists = old.workspaces.some(
          (oldWorkspace: any) => oldWorkspace.id === workspace.id,
        );

        if (exists) return old;

        return {
          ...old,
          workspaces: [workspace, ...old.workspaces],
          total: old.total + 1,
        };
      },
    );

    queryClient.invalidateQueries({
      queryKey: [KEY_QUERY.LIST_WORKSPACES],
    });
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (owner: any) => owner?.email,
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/workspaces/${record.id}`)}>
            Open
          </Button>

          {record.owner?.id === user?.id && (
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

      {selectedWorkspace && (
        <InviteModal
          open={openInvite}
          workspaceId={selectedWorkspace}
          onClose={() => setOpenInvite(false)}
        />
      )}
    </>
  );
};

export default WorkspaceList;
