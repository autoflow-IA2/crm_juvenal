import CopyCodeButton from './CopyCodeButton'

export const MarkdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1
      className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary-200 mt-8"
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: any) => (
    <h2
      className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: any) => (
    <h3
      className="text-xl font-semibold text-gray-900 mt-8 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ children, ...props }: any) => (
    <h4
      className="text-lg font-semibold text-primary-700 mt-6 mb-2"
      {...props}
    >
      {children}
    </h4>
  ),

  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <div className="relative">
        <CopyCodeButton code={String(children).replace(/\n$/, '')} />
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    )
  },

  pre: ({ children, ...props }: any) => (
    <pre
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto my-4 relative"
      {...props}
    >
      {children}
    </pre>
  ),

  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),

  th: ({ children, ...props }: any) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: any) => (
    <td
      className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200"
      {...props}
    >
      {children}
    </td>
  ),

  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className="text-primary-600 hover:text-primary-700 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),

  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-primary-50 text-gray-700 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  ul: ({ children, ...props }: any) => (
    <ul
      className="list-disc list-inside space-y-2 my-4 text-gray-700"
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: any) => (
    <ol
      className="list-decimal list-inside space-y-2 my-4 text-gray-700"
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),

  p: ({ children, ...props }: any) => (
    <p
      className="my-4 text-gray-700 leading-relaxed"
      {...props}
    >
      {children}
    </p>
  ),

  hr: ({ ...props }: any) => (
    <hr className="my-8 border-t border-gray-300" {...props} />
  ),

  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
}
