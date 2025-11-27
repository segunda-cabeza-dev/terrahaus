interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-gray-900 break-words">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
