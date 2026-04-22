import { Button } from "antd";
import CreateWorkspaceModal from "./modals/create_workspace_modal";
import { useState } from "react";
import WorkspaceList from "./components/workspace_list";

const WorkspacePage = () => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => setOpenCreate(true)}>Thêm Workspace</Button>
      <WorkspaceList />
      <CreateWorkspaceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default WorkspacePage;
