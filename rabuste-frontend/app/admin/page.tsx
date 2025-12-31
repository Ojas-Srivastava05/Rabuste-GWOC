export default function AdminPage() {
  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-8 shadow-xl space-y-10">

    
      {/* PAGE HEADING */}
    
      <h1 className="text-3xl font-bold text-[#2e211a]">
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}
   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="bg-[#FFFDF2] p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Revenue Today</p>
          <h2 className="text-3xl font-bold text-[#2e211a] mt-2">
            ₹12,840
          </h2>
          <p className="text-sm text-[#c68642] mt-3">
            +5.5% from yesterday
          </p>
        </div>

        {/* Orders */}
        <div className="bg-[#FFFDF2] p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Orders Completed</p>
          <h2 className="text-3xl font-bold text-[#2e211a] mt-2">
            287
          </h2>
          <p className="text-sm text-[#c68642] mt-3">
            +6.2% from yesterday
          </p>
        </div>

        {/* Returning Customers */}
        <div className="bg-[#FFFDF2] p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <p className="text-sm text-[#6b4a2f]">Returning Customers</p>
          <h2 className="text-3xl font-bold text-[#2e211a] mt-2">
            84
          </h2>
          <p className="text-sm text-[#c68642] mt-3">
            +8.2% from yesterday
          </p>
        </div>

      </div>

      {/* AI INSIGHTS */}
      <div className="bg-[#FFFDF2] p-6 rounded-xl shadow-inner border-l-4 border-[#c68642]">
        <h2 className="text-lg font-semibold text-[#2e211a] mb-4">
          🤖 AI Insights
        </h2>

        <ul className="space-y-3 text-sm text-[#3a2618]">
          <li>🥇 <b>Most sold item:</b> Latte (124 orders)</li>
          <li>🔥 <b>Peak order time:</b> 6 PM – 8 PM</li>
          <li>⚠️ <b>Low stock:</b> Espresso Beans (2 left)</li>
          <li>📉 <b>Slow-moving item:</b> Brownie (no sales in 8 days)</li>
          <li>💡 <b>Suggestion:</b> Apply 10% discount on Cold Coffee</li>
        </ul>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <a
          href="/admin/orders"
          className="bg-[#3a2618] text-[#fffbd6] px-4 py-3 rounded-xl shadow-md
                     hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-sm text-[#e6d8c6] mt-0.5">
            View and assign order slots
          </p>
        </a>

        <a
          href="/admin/menu"
          className="bg-[#3a2618] text-[#fffbd6] p-6 rounded-xl shadow-md
                     hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <h2 className="text-lg font-semibold">Menu</h2>
          <p className="text-sm text-[#e6d8c6] mt-0.5">
            Manage menu items & stock
          </p>
        </a>

        <a
          href="/admin/workshops"
          className="bg-[#3a2618] text-[#fffbd6] p-6 rounded-xl shadow-md
                     hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <h2 className="text-lg font-semibold">Workshops</h2>
          <p className="text-sm text-[#e6d8c6] mt-2">
            Create and manage workshops
          </p>
        </a>

      </div>
    </div>
  );
}
