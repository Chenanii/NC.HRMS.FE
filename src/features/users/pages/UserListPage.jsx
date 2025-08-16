import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../services/userService";
import { Button, Modal, Title, Group, Divider } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import UserForm from "../components/UserForm";
import "../../../index.css";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers().then(res => setUsers(res.data.result || []));
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAdd = () => {
    setEditUser(null);
    setModalOpened(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
    setEditUser(null);
    fetchUsers().then(res => setUsers(res.data.result || []));
  };

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Employee Management</h2>
      <Button
        leftSection={<FontAwesomeIcon icon={faPlus} />}
        className="add-user-link"
        color="indigo"
        radius="md"
        size="md"
        style={{ marginBottom: 24 }}
        onClick={handleAdd}
      >
        Add Employee
      </Button>
      <Modal
        opened={modalOpened}
        onClose={handleModalClose}
        title={
          <Group spacing="xs">
            <FontAwesomeIcon icon={editUser ? faEdit : faPlus} style={{ color: "#6366f1" }} />
            <Title order={4} style={{ color: "#232946" }}>
              {editUser ? "Edit Employee" : "Add New Employee"}
            </Title>
          </Group>
        }
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="lg"
        size="lg"
        padding="lg"
        withCloseButton
        transitionProps={{ transition: 'pop', duration: 200 }}
      >
        <Divider my="sm" />
        <UserForm
          onSuccess={handleModalClose}
          initialData={editUser}
          isEdit={!!editUser}
        />
      </Modal>
      <table className="user-table">
        <thead>
          <tr>
            <th>Employee #</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.employeeNumber}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.departmentId}</td>
                <td>{user.positionId}</td>
                <td>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => handleDelete(user.id)}
                    className="action-btn"
                    style={{ marginRight: 8 }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="subtle"
                    color="blue"
                    size="xs"
                    onClick={() => handleEdit(user)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}