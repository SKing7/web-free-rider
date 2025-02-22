import axios from "axios"

export const fetchCameraCoordinateData = () => {
  return axios.get("/data.json").then((res) => {
    console.log(res.data)
    return res.data
  });
}