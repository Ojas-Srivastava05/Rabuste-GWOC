// import axios from "axios";

const isTest = process.env.NODE_ENV !== "production";

export const createPetpoojaOrder = async ({ items, totalAmount, customer }) => {
  /* TEST MODE (ACTIVE) */
  if (isTest) {
    return {
      success: true,
      petpoojaOrderId: "PP_TEST_" + Date.now(),
      status: "ORDER_PLACED"
    };
  }

  /* 
      REAL PETPOOJA API
     (UNCOMMENT LATER)
  

  /*
  const response = await axios.post(
    `${process.env.PETPOOJA_BASE_URL}/order/create`,
    {
      order_type: "pickup",
      payment_type: "online",
      total_amount: totalAmount,
      items: items.map(item => ({
        item_name: item.name,
        quantity: item.qty,
        price: item.price
      })),
      customer_details: {
        name: customer.name,
        phone: customer.phone
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PETPOOJA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return {
    success: true,
    petpoojaOrderId: response.data.order_id,
    status: response.data.status
  };
  */
};
