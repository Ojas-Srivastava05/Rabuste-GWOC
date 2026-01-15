import axios from "axios";

const isTest = process.env.NODE_ENV === "test";

export const sendOrderToReelo = async (customerData) => {
  if (isTest) {
    return {
      success: true,
      message: "Reelo test customer created"
    };
  }

  const response = await axios.post(
    `${process.env.REELO_BASE_URL}/customer`,
    customerData,
    {
      headers: {
        Authorization: `Bearer ${process.env.REELO_API_KEY}`
      }
    }
  );

  return response.data;
};
