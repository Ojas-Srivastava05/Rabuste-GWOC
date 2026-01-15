// import axios from "axios";

const isTest = process.env.NODE_ENV !== "production";

export const sendOrderToReelo = async ({ customer, orderId, amount }) => {
  /* TEST MODE (ACTIVE) */
  if (isTest) {
    return {
      success: true,
      message: "Reelo test trigger success"
    };
  }

  /* 
     REAL REELO API
     (UNCOMMENT LATER) */

  /*
  const response = await axios.post(
    `${process.env.REELO_BASE_URL}/customer`,
    {
      phone: customer.phone,
      name: customer.name,
      last_order_id: orderId,
      last_order_value: amount
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.REELO_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
  */
};
