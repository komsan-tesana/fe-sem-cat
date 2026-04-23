import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Tag, Space, message, Modal, Form, Input, Select } from "antd";
import { getUsers, updateUser, deleteUser } from "@/app/shared/services/user-service";
import { useState } from "react";

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: 1000 * 60,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      message.success("User updated");
      setEditModalOpen(false);
      setEditingUser(null);
    },
    onError: (err) => {
      message.error(err.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["adminUsers"] });
      const previousUsers = queryClient.getQueryData(["adminUsers"]);
      queryClient.setQueryData(["adminUsers"], (old) =>
        old ? old.filter((u) => u.id !== id) : []
      );
      return { previousUsers };
    },
    onSuccess: () => {
      message.success("User deleted");
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["adminUsers"], context.previousUsers);
      message.error(err.message || "Failed to delete user");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const filteredUsers = users.filter((user) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      user.email?.toLowerCase().includes(search) ||
      user.name?.toLowerCase().includes(search)
    );
  });

  const tableData = filteredUsers.map((user) => ({
    key: user.id,
    id: user.id,
    email: user.email,
    name: user.name || "-",
    role: user.role || "user",
    createdAt: user.createdAt,
  }));

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colorMap = {
          admin: "red",
          user: "blue",
        };
        return <Tag color={colorMap[role] || "default"}>{role}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString("th-TH") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record.id, record.email)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (id, email) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${email}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleEditSubmit = (values) => {
    if (!editingUser) return;
    updateMutation.mutate({ id: editingUser.id, data: values });
  };

  return (
    <div className="page">
      <div style={{ padding: "var(--space-lg)" }}>
        <h1>Users Management</h1>

        <Input
          placeholder="Search by email or name"
          style={{ width: 300, marginBottom: 16 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        <Table
          dataSource={tableData}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Edit User"
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setEditingUser(null);
          }}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={editingUser || {}}
            onFinish={handleEditSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Select
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}