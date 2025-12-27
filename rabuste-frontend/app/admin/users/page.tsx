"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked?: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Block / Unblock user
  const toggleBlock = async (userId: string, block: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ block }),
      });

      if (!res.ok) throw new Error("Action failed");

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="p-6 text-muted">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-lg">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  {user.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        toggleBlock(user._id, !user.isBlocked)
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        user.isBlocked
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center p-6 text-muted">No users found</p>
        )}
      </div>
    </div>
  );
}
