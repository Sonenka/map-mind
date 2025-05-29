const BackgroundVideo = () => (
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
  >
    <source src="/bg.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

export default BackgroundVideo;
