import axios from "axios"

export const fetchCameraCoordinateData = () => {
  return axios.get("/data.json").then((res) => {
    console.log(res.data)
    return res.data
  });
}

// 请求屏幕常亮
export const requestWakeLock = async () => {
  if (!navigator.wakeLock) {
    return alert('No support for wakeLock');
  }
  try {
    const wakeLock = await navigator.wakeLock.request('screen');
    console.log('屏幕常亮已启用');
    wakeLock.addEventListener('release', () => {
      console.log('屏幕常亮已释放');
    });
  } catch (err) {
    console.log(err);
    alert('启用屏幕常亮失败');
  }
};