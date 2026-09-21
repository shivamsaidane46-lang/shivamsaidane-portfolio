/**
 * HeroAtmosphere — the atmospheric glow layer behind the hero text.
 * Consists of:
 *   1. A radial cyan gradient centred on the viewport
 *   2. A violet glow blob (top-right)
 *   3. A cyan glow blob (bottom-left)
 *   4. Top and bottom gradient scrims that fade to void
 */
export function HeroAtmosphere() {
  return (
    <>
      {/* Centred cyan radial scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: 'radial-gradient(circle at 50% 45%, rgba(0,229,255,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Violet glow blob — top right */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '-12rem',
          width: '24rem',
          height: '24rem',
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.10)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Cyan glow blob — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '-8rem',
          width: '20rem',
          height: '20rem',
          borderRadius: '50%',
          background: 'rgba(0,229,255,0.10)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top + bottom gradient scrims — fade to void */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(12,14,19,0.5) 0%, transparent 30%, transparent 70%, rgba(12,14,19,0.8) 100%)',
        }}
      />
    </>
  );
}
