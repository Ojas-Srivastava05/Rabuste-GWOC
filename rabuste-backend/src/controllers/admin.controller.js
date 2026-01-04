import User from "../models/User.js";
import Order from "../models/order.js";
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

/* GET AI CONFIG */
export const getAIConfig = async (req, res) => {
  try {
    let config = await AIConfig.findOne();
    if (!config) {
      config = await AIConfig.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch AI config" });
  }
};

/* UPDATE AI CONFIG */
export const updateAIConfig = async (req, res) => {
  try {
    const {
      lowStockLimit,
      inactiveDays,
      enableDiscountAI,
      discountItemId,
      discountPercent,
    } = req.body;

    const config = await AIConfig.findOneAndUpdate(
      {},
      {
        lowStockLimit,
        inactiveDays,
        enableDiscountAI,
        discountItemId: discountItemId || null,
        discountPercent,
      },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to update AI config" });
  }
};

/* GET DISCOUNT SUGGESTIONS (last 7 days, sales-based) */
export const getDiscountSuggestions = async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [orders, menuItems] = await Promise.all([
      Order.find({ createdAt: { $gte: since } }).select("items createdAt"),
      Menu.find().select("name"),
    ]);

    const soldByItemId = new Map();

    for (const order of orders) {
      const items = Array.isArray(order.items) ? order.items : [];
      for (const item of items) {
        const itemId = item?.itemId;
        const quantity = Number(item?.quantity ?? 0);
        if (!itemId) continue;
        const prev = soldByItemId.get(String(itemId)) ?? 0;
        soldByItemId.set(String(itemId), prev + (Number.isFinite(quantity) ? quantity : 0));
      }
    }

    const suggestions = menuItems
      .map((m) => {
        const id = String(m._id);
        return {
          _id: id,
          name: m.name,
          soldLast7Days: soldByItemId.get(id) ?? 0,
        };
      })
      .sort((a, b) => a.soldLast7Days - b.soldLast7Days)
      .slice(0, 10);

    res.json({ since, suggestions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch discount suggestions" });
  }
};
