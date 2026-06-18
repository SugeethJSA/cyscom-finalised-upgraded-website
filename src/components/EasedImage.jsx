const EasedImage = ({ src, alt }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="size-full object-cover"
        style={{
          opacity: 0,
          transition: "opacity 0.7s ease-in",
        }}
        onLoad={(e) => {
          e.currentTarget.style.opacity = 1;
        }}
      />
    </div>
  );
};

export default EasedImage;