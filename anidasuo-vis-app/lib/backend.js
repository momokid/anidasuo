export async function sendFrameToBackend(photo) {
  if (!photo?.uri) return null;

  const formData = new FormData();

  if (photo.uri.startsWith("data")) {
    const response = await fetch(photo.uri);
    const blob = await response.blob();

    formData.append("file", blob, "frame.jpg"); //UploadFile-compatible
  } else {
    formData.append("file", {
      uri: photo.uri,
      name: "frame.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const response = await fetch("http://10.102.251.123:8000/detect/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      throw new Error("Backend detection failed");
    }

    const data = await response.json();
    console.log("Detection result:", data);

    return data;
  } catch (error) {
    console.warn("Backend error:", error);
  }

  //   return await response.json();
}
