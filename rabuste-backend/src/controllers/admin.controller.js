import User from "../models/User.js";
import Order from "../models/Order.js";
import Menu from "../models/menu.js";
import AIConfig from "../models/aiconfig.js";

export const getAllUsers=async (req,res)=>{
    try{
        const users=await User.find().select("-password");
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:"Failed to fetch data"});
    }

};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("assignedStoreId", "name location");

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/*assigning pickup s;ot*/
export const assignPickupSlot = async (req, res) => {
    try {
      const { slot } = req.body;
  
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          pickupSlot: slot,
          status: "assigned",
        },
        { new: true }
      );
  
      res.json(order);
    } catch {
      res.status(500).json({ message: "Failed to assign slot" });
    }
  };
  
  

export const getAdminDashboard = async (req, res) => {
  try {
    // Ensure config exists
    let config = await AIConfig.findOne();
    if (!config) {
      config = await AIConfig.create({});
    }

    const orders = await Order.find();
    const menuItems = await Menu.find();

    // ====== STATS ======
    const totalUsers = await User.countDocuments();
    const totalOrders = orders.length;

    const revenueToday = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    // ====== MOST SOLD ITEM ======
    const itemCount = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    const mostSoldItem = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])[0];

    // ====== LOW STOCK ======
    const lowStockItems = menuItems.filter(
      item => item.stock < config.lowStockLimit
    );

    // ====== PEAK HOUR ======
    const hourMap = {};
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourMap)
      .sort((a, b) => b[1] - a[1])[0];

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        revenueToday,
      },
      insights: {
        mostSoldItem: mostSoldItem
          ? { name: mostSoldItem[0], count: mostSoldItem[1] }
          : null,
        lowStockItems,
        peakHour: peakHour
          ? `${peakHour[0]}:00 - ${+peakHour[0] + 1}:00`
          : null,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin dashboard error" });
  }
};
