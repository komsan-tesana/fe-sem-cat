import { useState, useCallback } from "react";
import { useAuth } from "@/app/providers/auth";
import { Button, Form, Input, Card, message, Tabs } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export function Auth() {
  const location = useLocation();
  const state = location.state;
  const [initialMode, setInitialMode] = useState(state?.mode || "signup");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, login } = useAuth();
  const [form] = Form.useForm();

  const onSubmit = useCallback(async (values) => {
    setError(null);
    setLoading(true);

    let result;
    try {
      if (initialMode === "signup") {
        result = await signUp(values.email, values.password);
      } else {
        result = await login(values.email, values.password);
      }
    } catch (err) {
      result = { success: false, error: err.message || "An error occurred" };
    }

    setLoading(false);

    if (result.success) {
      message.success(initialMode === "signup" ? "Account created!" : "Welcome back!");
      navigate("/");
    } else {
      setError(result.error);
    }
  }, [initialMode, signUp, login, navigate]);

  const toggleMode = useCallback(() => {
    setError(null);
    form.resetFields();
    if(initialMode === "signup") {
      setInitialMode("login");
    }else{
      setInitialMode("signup");
    }
  }, [form,initialMode]);

  const items = [
    {
      key: "signup",
      label: "Sign Up",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          size="large"
          requiredMark={false}
        >
          {error && (
            <div className="form-error-banner" role="alert">
              {error}
            </div>
          )}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              variant="solid"
              color="primary"
              loading={loading}
              block
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "login",
      label: "Login",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          size="large"
          requiredMark={false}
        >
          {error && (
            <div className="form-error-banner" role="alert">
              {error}
            </div>
          )}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              variant="solid"
              color="primary"
              loading={loading}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="container">
        <Card className="auth-card" bordered={false}>
          <div className="auth-header">
            <h1 className="auth-title">
              {initialMode === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="auth-subtitle">
              {initialMode === "signup"
                ? "Join us to help cats find their forever homes"
                : "Sign in to continue helping cats"}
            </p>
          </div>
          <Tabs
            activeKey={initialMode}
            items={items}
            onChange={toggleMode}
            centered
          />
        </Card>
      </div>
    </div>
  );
}
