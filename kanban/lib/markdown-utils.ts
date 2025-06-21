// Simple markdown to HTML converter for basic formatting
export function parseMarkdown(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-8">$1</h1>')

    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')

    // Code blocks
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-black/40 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-green-300 text-sm font-mono">$1</code></pre>',
    )
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-2 py-1 rounded text-sm font-mono text-blue-300">$1</code>')

    // Links
    .replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Lists
    .replace(/^\* (.*$)/gim, '<li class="text-white/80 mb-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="text-white/80 mb-1">$1</li>')

    // Line breaks
    .replace(/\n\n/g, '</p><p class="text-white/80 leading-relaxed mb-4">')
    .replace(/\n/g, "<br>")

  // Wrap in paragraphs and handle lists
  html = html
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 mb-4 ml-4">$1</ul>')
    .replace(/(<\/li>)\s*(<li)/g, "$1$2") // Remove breaks between list items

  // Wrap remaining content in paragraphs
  if (!html.startsWith("<h") && !html.startsWith("<pre") && !html.startsWith("<ul")) {
    html = `<p class="text-white/80 leading-relaxed mb-4">${html}</p>`
  }

  return html
}

// Extract title from markdown content (first # heading or filename)
export function extractTitle(markdown: string, filename?: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    return titleMatch[1].trim()
  }

  if (filename) {
    return filename.replace(/\.(md|txt)$/i, "").replace(/[-_]/g, " ")
  }

  return "Untitled Document"
}
