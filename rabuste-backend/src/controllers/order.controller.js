import Order from "../models/order.js";
import Store from "../models/store.js";
import { calculateDistance, calculateTimeToCafe } from "../utils/distance.utils.js";
import { createPetpoojaOrder } from "../services/petpooja.service.js";
import { sendOrderToReelo } from "../services/reelo.service.js";

/* USER places order */
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      userLocation,
      totalAmount,
      instructions,
      couponCode,
      couponDiscount,
      paymentId,
      paymentStatus
    } = req.body;

    const userId = req.user._id;

    if (!userLocation) {
      return res.status(400).json({ message: "User location required" });
    }

    const stores = await Store.find();
    if (!stores.length) {
      return res.status(500).json({ message: "No stores available" });
    }

    //  Find nearest store
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

    const estimatedTimeToCafe = calculateTimeToCafe(minDistance);
    const defaultPreparationTime = 5 + items.length * 2;

    //  Create local order
    const order = await Order.create({
      userId,
      items,
      userLocation,
      assignedStoreId: nearestStore._id,
      status: "pending",
      price: totalAmount || 0,
      totalAmount: totalAmount || 0,
      instructions,
      couponCode,
      couponDiscount,
      paymentId,
      paymentStatus,
      distanceFromCafe: minDistance,
      estimatedTimeToCafe,
      preparationTime: defaultPreparationTime
    });

    // Send order to Petpooja (TEST MODE)
    const petpoojaRes = await createPetpoojaOrder({
      items,
      totalAmount,
      customer: {
        userId
      }
    });

    //  save Petpooja order ID
    order.petpoojaOrderId = petpoojaRes.petpoojaOrderId;
    await order.save();

    // Send customer/order info to Reelo
    await sendOrderToReelo({
      customer: {
        userId
      },
      orderId: order._id,
      amount: totalAmount
    });

    res.status(201).json({
      success: true,
      order,
      nearestStore: nearestStore.name,
      distanceKm: minDistance.toFixed(2),
      petpoojaOrderId: petpoojaRes.petpoojaOrderId,
      mode: "TEST"
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};
