type FeatureCardProps = {
  icon: string
  title: string
  description: string
  layout?: 'vertical' | 'horizontal'
}

export default function FeatureCard({
  icon,
  title,
  description,
  layout = 'vertical',
}: FeatureCardProps) {
  if (layout === 'horizontal') {
    return (
      <div className="bg-white/50 rounded-lg p-6 border border-ariad-green-water flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-lg bg-ariad-green-water flex items-center justify-center">
          <i className={`bi ${icon} text-white text-xl`} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg mb-2">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/50 rounded-lg p-6 border border-ariad-green-water">
      <div className="w-10 h-10 rounded-lg bg-ariad-green-water flex items-center justify-center mb-4">
        <i className={`bi ${icon} text-white text-xl`} aria-hidden="true" />
      </div>
      <h3 className="text-lg mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}
