import axios from "../utils/axios";

export async function getServiceOrders(requestBody) {
  try {
    const req = await axios.post("/user/get_service_orders", requestBody);
    return req.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
}
