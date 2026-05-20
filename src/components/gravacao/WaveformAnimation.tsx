type WaveformAnimationProps = {
  ativo: boolean
}

const BARRAS = 7
const ALTURAS = [60, 85, 45, 100, 55, 90, 70]
const DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.2]

export default function WaveformAnimation({ ativo }: WaveformAnimationProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: BARRAS }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-ariad-green-water"
          style={{
            height: ativo ? undefined : '20%',
            animation: ativo
              ? `waveform 0.8s ease-in-out ${DELAYS[i]}s infinite alternate`
              : 'none',
            minHeight: 4,
            maxHeight: '100%',
          }}
        />
      ))}
      <style>{`
        @keyframes waveform {
          0% { height: 20%; }
          ${ALTURAS.map((_, i) => `${((i + 1) / ALTURAS.length) * 100}% { height: ${ALTURAS[i]}%; }`).join('\n          ')}
          100% { height: 20%; }
        }
      `}</style>
    </div>
  )
}
