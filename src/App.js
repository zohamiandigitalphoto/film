import React, { useState, useEffect, useCallback } from "react";

function App() {
  // Generate shuffled images
  const generateShuffledImages = useCallback(() => {
    const images = [];
    for (let i = 1; i <= 38; i++) {
      const num = i.toString().padStart(2, "0"); // Pads 1 → 01, 2 → 02, etc.
      images.push(`${process.env.PUBLIC_URL}/images/image${num}.jpg`);
    }

    // Shuffle array
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
    return images;
  }, []);

  const [shuffledImages, setShuffledImages] = useState(generateShuffledImages);
  const [index, setIndex] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);

  // Preload all images
  useEffect(() => {
    shuffledImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [shuffledImages]);

  const nextImage = useCallback(() => {
    setIndex((prev) => {
      if (prev + 1 >= shuffledImages.length) {
        setShuffledImages(generateShuffledImages());
        return 0;
      }
      return prev + 1;
    });
  }, [shuffledImages, generateShuffledImages]);

  const handleClick = () => {
    nextImage();

    if (!musicStarted) {
      const audio = document.getElementById("bg-music");
      if (audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setMusicStarted(true))
            .catch((error) => console.log("Music play prevented:", error));
        }
      }
    }
  };

  // Auto-change image every 2 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 2000);
    return () => clearInterval(interval);
  }, [nextImage]);

  // Get the actual image number for alt text
  const getImageNumber = (src) => {
    const match = src.match(/image(\d{2})\.jpg$/);
    return match ? parseInt(match[1], 10) : index + 1;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#D3D3D3",
      }}
    >
      <img
        src={shuffledImages[index]}
        alt={`Random ${getImageNumber(shuffledImages[index])}`}
        onClick={handleClick}
        style={{
          maxWidth: "400px",
          maxHeight: "400px",
          cursor: "pointer",
          objectFit: "contain",
          marginBottom: "20px",
        }}
      />
      <audio
        id="bg-music"
        src={`${process.env.PUBLIC_URL}/music/background.mp3`}
        loop
      />
    </div>
  );
}

export default App;
