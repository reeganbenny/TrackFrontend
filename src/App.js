import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState(false);
  const [watchId, setWatchId] = useState(0);
  const [position, setPosition] = useState({});
  const api = "https://locationbackend.onrender.com/location/add-location";
  // const api = "http://localhost:3030/location/add-location";
  useEffect(() => {
    console.log("Status Changed to ", status);
    if (status) {
      setWatchId(
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("latitude - ", latitude, " longitude - ", longitude);
            setPosition({
              latitude: latitude,
              longitude: longitude,
            });
          },
          (error) => {
            console.log("Error- ", error);
          }
        )
      );
    } else if (watchId > 0) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(0);
    }
  }, [status]);

  useEffect(() => {
    if (status) {
      alert(
        "WatchId: ",
        watchId,
        " longitude: ",
        longitude,
        " latitude:",
        latitude
      );
      console.log("Position", position);
      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          watchId: watchId,
          longitude: position.longitude,
          latitude: position.latitude,
          speed: position.speed,
        }),
      }).then((res) => {
        console.log(res);
      });
    }
  }, [position]);

  const handleStatus = () => {
    setStatus(!status);
  };
  return (
    <div className="App">
      <div className="status">
        <button onClick={handleStatus}>{status ? "Stop" : "Start"}</button>
      </div>
      {status && (
        <div className="location">
          longitude: {position.longitude}
          latitude : {position.latitude}
        </div>
      )}
    </div>
  );
}

export default App;
