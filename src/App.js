import React, { useState, useEffect, useCallback } from "react";

function App() {
  // Generate shuffled images
  const generateShuffledImages = useCallback(() => {
    const images = [];
    for (let i = 1; i <= 25; i++) images.push(`/images/image${i}.jpg`);

    // Shuffle
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
    return images;
  }, []);

  const [shuffledImages, setShuffledImages] = useState(generateShuffledImages);
  const [index, setIndex] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);

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
            .then(() => {
              setMusicStarted(true);
            })
            .catch((error) => {
              console.log("Music play prevented:", error);
            });
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#D3D3D3"
      }}
    >
      <img
        src={shuffledImages[index]}
        alt="Random"
        onClick={handleClick}
        style={{
          maxWidth: "400px",
          maxHeight: "400px",
          cursor: "pointer",
          objectFit: "contain"
        }}
      />
     
    </div>
  );
}

export default App;
