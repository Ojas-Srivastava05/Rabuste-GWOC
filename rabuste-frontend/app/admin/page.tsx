export default function AdminPage() {
  return (
    <div>
      {/* Page heading */}
      <h1 className="text-2xl font-bold mb-6 text-[#2e211a]">
        Admin Dashboard
      </h1>

      {/* Quick actions / links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="/admin/orders"
          className="bg-[#3a2618] text-[#fffbd6] p-6 rounded-lg border border-[#4a3325] hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-sm text-[#e6d8c6] mt-1">
            View and assign order slots
          </p>
        </a>

        <a
          href="/admin/menu"
          className="bg-[#3a2618] text-[#fffbd6] p-6 rounded-lg border border-[#4a3325] hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Menu</h2>
          <p className="text-sm text-[#e6d8c6] mt-1">
            Manage menu items & stock
          </p>
        </a>

        <a
          href="/admin/workshops"
          className="bg-[#3a2618] text-[#fffbd6] p-6 rounded-lg border border-[#4a3325] hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Workshops</h2>
          <p className="text-sm text-[#e6d8c6] mt-1">
            Create and manage workshops
          </p>
        </a>
      </div>
    </div>
  );
}
