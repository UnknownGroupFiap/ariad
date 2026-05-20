import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const errorId = `${textareaId}-error`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-medium mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg  placeholder:/40 focus:outline-none focus:ring-2 focus:ring-ariad-green-water resize-none ${
            error ? 'border-red-500' : 'border-ariad-green-water'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
