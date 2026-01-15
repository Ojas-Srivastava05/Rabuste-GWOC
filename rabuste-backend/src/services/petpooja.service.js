import axios from "axios";

const isTest = process.env.NODE_ENV === "test"; //later change test to production

export const createPetpoojaOrder = async (orderData) => {
  if (isTest) {
    // MOCK RESPONSE (same shape as real)
    return {
      success: true,
      order_id: "PP_TEST_12345",
      status: "ORDER_PLACED"
    };
  }

  const response = await axios.post(
    `${process.env.PETPOOJA_BASE_URL}/order/create`,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${process.env.PETPOOJA_API_KEY}`
      }
    }
  );

  return response.data;
};
