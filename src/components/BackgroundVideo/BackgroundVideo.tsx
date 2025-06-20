import styles from './BackgroundVideo.module.css';

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={styles.video}
    >
      <source src="/bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}