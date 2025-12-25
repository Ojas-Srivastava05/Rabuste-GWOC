import User from "../models/User.js";
import Users from "../models/User.js";
import Order from "../models/Order.js";

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
  