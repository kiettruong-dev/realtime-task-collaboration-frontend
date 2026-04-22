import { useAuth } from "@/hooks";
import { Button, Form, Input, Typography } from "antd";
import Card from "antd/es/card/Card";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = (values: any) => {
    register(values);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Register" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
          <div style={{ marginTop: 10 }}>
            Already have an account?{" "}
            <Typography.Link onClick={() => navigate("/login")}>
              Login
            </Typography.Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
