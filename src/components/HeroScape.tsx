import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal, Pause, Play } from 'lucide-react';

export const heroScenes = [
  { title: 'A quieter interior', place: 'Nairobi · Kenya', poster: '/images/interior-living-room.jpg', video: '/videos/interior-living.mp4', alt: 'A warm, light-filled living room opening onto a garden, concept imagery', camera: { fromX: '-1.5%', toX: '1.4%', fromY: '0.4%', toY: '-0.5%' } },
  { title: 'The arrival', place: 'Karen · Nairobi', poster: '/images/hero-karen-residence.jpg', video: '/videos/karen-residence.mp4', alt: 'A contemporary stone and timber home at blue hour, concept imagery', camera: { fromX: '1.6%', toX: '-1.5%', fromY: '0.6%', toY: '-0.4%' } },
  { title: 'Above the city', place: 'Westlands · Nairobi', poster: '/images/westlands-penthouse.jpg', video: '/videos/westlands-penthouse.mp4', alt: 'A rooftop residence looking across Westlands at dusk, concept imagery', camera: { fromX: '-1.7%', toX: '1.3%', fromY: '-0.5%', toY: '0.5%' } },
  { title: 'First light', place: 'Nairobi · Kenya', poster: '/images/nairobi-city.jpg', video: '/videos/nairobi-dawn.mp4', alt: 'Nairobi skyline beyond the city canopy at dawn, concept imagery', camera: { fromX: '1.4%', toX: '-1.7%', fromY: '0.5%', toY: '-0.6%' } },
];

const TRANSITION_MS = 1050;
// Keep the scene sequence; the tour controls/disclosure panel is intentionally hidden from public pages.
const SHOW_PUBLIC_TOUR_PANEL = false;

function supportsCinematicMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const dataSaver = Boolean(connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g');
  return !reduced && !dataSaver;
}

export function HeroScape() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [automaticTour, setAutomaticTour] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(supportsCinematicMotion);
  const [readyVideos, setReadyVideos] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const currentIndex = useRef(0);
  const gestureStartX = useRef<number | null>(null);
  const gestureStartPan = useRef(0);
  const viewPan = useRef(0);
  const transitionTimer = useRef<number | null>(null);

  const changeScene = useCallback((targetIndex: number) => {
    const nextIndex = (targetIndex + heroScenes.length) % heroScenes.length;
    const priorIndex = currentIndex.current;
    if (nextIndex === priorIndex) return;
    currentIndex.current = nextIndex;
    setReadyVideos([]);
    viewPan.current = 0;
    visualRef.current?.style.setProperty('--hero-view-pan', '0%');
    setPreviousIndex(priorIndex);
    setActiveIndex(nextIndex);
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setPreviousIndex(null), TRANSITION_MS);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(supportsCinematicMotion());
    preference.addEventListener?.('change', update);
    return () => {
      preference.removeEventListener?.('change', update);
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!automaticTour || !motionAllowed) return;
    const timer = window.setTimeout(() => changeScene(activeIndex + 1), 8200);
    return () => window.clearTimeout(timer);
  }, [activeIndex, automaticTour, motionAllowed, changeScene]);

  useEffect(() => {
    if (!motionAllowed) setReadyVideos([]);
  }, [motionAllowed]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index !== activeIndex || !motionAllowed || !automaticTour) {
        video.pause();
        return;
      }
      const playAttempt = video.play();
      playAttempt?.catch(() => {
        // The poster remains as a graceful fallback if a browser blocks background playback.
      });
    });
  }, [activeIndex, automaticTour, motionAllowed, previousIndex]);

  function showReadyVideo(index: number) {
    setReadyVideos((current) => current.includes(index) ? current : [...current, index]);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    gestureStartX.current = event.clientX;
    gestureStartPan.current = viewPan.current;
    setDragging(true);
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* pointer capture is optional */ }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (gestureStartX.current === null) return;
    const width = event.currentTarget.clientWidth || window.innerWidth;
    const delta = event.clientX - gestureStartX.current;
    const nextPan = Math.min(9, Math.max(-9, gestureStartPan.current - (delta / width) * 24));
    viewPan.current = nextPan;
    event.currentTarget.style.setProperty('--hero-view-pan', `${nextPan}%`);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (gestureStartX.current === null) return;
    const delta = event.clientX - gestureStartX.current;
    gestureStartX.current = null;
    setDragging(false);
    if (Math.abs(delta) > 58) changeScene(activeIndex + (delta < 0 ? 1 : -1));
  }

  const visibleIndices = previousIndex === null ? [activeIndex] : [previousIndex, activeIndex];
  const scene = heroScenes[activeIndex];

  return (
    <div className="hero-scape">
      <div ref={visualRef} className={`hero-scape__visual ${dragging ? 'hero-scape__visual--dragging' : ''} ${!motionAllowed ? 'hero-scape__visual--static' : ''}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={(event) => { gestureStartX.current = null; setDragging(false); viewPan.current = 0; event.currentTarget.style.setProperty('--hero-view-pan', '0%'); }} aria-hidden="true">
        {visibleIndices.map((index) => {
          const item = heroScenes[index];
          const active = index === activeIndex;
          const cameraStyle = {
            '--camera-from-x': item.camera.fromX,
            '--camera-to-x': item.camera.toX,
            '--camera-from-y': item.camera.fromY,
            '--camera-to-y': item.camera.toY,
          } as CSSProperties;
          return (
            <div className={`hero-scene-layer ${active ? 'hero-scene-layer--active' : 'hero-scene-layer--previous'} ${motionAllowed && readyVideos.includes(index) ? 'hero-scene-layer--video-ready' : ''}`} key={index} style={cameraStyle}>
              <img className="hero-scene-poster" src={item.poster} alt="" draggable={false} fetchPriority={active ? 'high' : undefined} />
              {motionAllowed && <video
                ref={(node) => { videoRefs.current[index] = node; }}
                muted
                playsInline
                preload={active ? 'auto' : 'none'}
                poster={item.poster}
                onPlaying={() => showReadyVideo(index)}
                onError={() => setReadyVideos((current) => current.filter((value) => value !== index))}
                onEnded={() => { if (active && automaticTour && motionAllowed) changeScene(index + 1); }}
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src={item.video} type="video/mp4" />
              </video>}
            </div>
          );
        })}
        <div className="hero-scape__shade" />
        <div className="hero-scape__grain" />
      </div>

      {SHOW_PUBLIC_TOUR_PANEL && <div className="hero-tour-panel" role="group" aria-label="Cinematic property views">
        <div className="hero-tour-panel__top">
          <div className="hero-tour-panel__copy" aria-live="off">
            <span className="eyebrow"><i className="hero-tour-panel__live-dot" /> ENKOP · SCENIC TOUR</span>
            <strong>{scene.title}</strong>
            <span className="hero-tour-panel__place">{scene.place}</span>
          </div>
          <div className="hero-tour-panel__controls">
            <button type="button" onClick={() => setAutomaticTour((playing) => !playing)} disabled={!motionAllowed} aria-label={motionAllowed ? (automaticTour ? 'Pause automatic tour' : 'Resume automatic tour') : 'Automatic playback is disabled by your motion or data-saving preference'} aria-pressed={motionAllowed && !automaticTour} title={!motionAllowed ? 'Automatic motion is disabled for this device preference' : undefined}>
              {automaticTour && motionAllowed ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button type="button" onClick={() => changeScene(activeIndex - 1)} aria-label="Previous scene"><ChevronLeft size={17} /></button>
            <button type="button" onClick={() => changeScene(activeIndex + 1)} aria-label="Next scene"><ChevronRight size={17} /></button>
          </div>
        </div>
        <div className="hero-tour-panel__progress" aria-label="Choose a tour view">
          {heroScenes.map((item, index) => <button key={item.title} type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => changeScene(index)} aria-label={`Show view ${index + 1}: ${item.title}`} aria-pressed={index === activeIndex}><span /></button>)}
        </div>
        <div className="hero-tour-panel__foot"><span><MoveHorizontal size={13} /> Drag or swipe to explore</span><span>{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(heroScenes.length).padStart(2, '0')}</span></div>
        <span className="hero-tour-panel__disclosure">ILLUSTRATIVE MOTION STUDY · NAIROBI</span>
      </div>}
    </div>
  );
}
