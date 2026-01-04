import Order from "../models/order.js";
import Store from "../models/store.js";
import { calculateDistance } from "../utils/distance.utils.js";

/* USER places order */
export const placeOrder = async (req, res) => {
  try {
    const { items, userLocation } = req.body;
    const userId = req.user._id;

    if (!userLocation) {
      return res.status(400).json({ message: "User location required" });
    }

    const stores = await Store.find();
    if (!stores.length) {
      return res.status(500).json({ message: "No stores available" });
    }

    // find nearest store
    let nearestStore = null;
    let minDistance = Infinity;

    stores.forEach((store) => {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        store.location.lat,
        store.location.lng
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestStore = store;
      }
    });

    const order = await Order.create({
      userId,
      items,
      userLocation,
      assignedStoreId: nearestStore._id,
      status: "pending",
    });

    res.status(201).json({
      order,
      nearestStore: nearestStore.name,
      distanceKm: minDistance.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order" });
  }
};
