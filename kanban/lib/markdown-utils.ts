// Enhanced markdown to HTML converter with improved formatting
export function parseMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headers (process before other replacements)
    .replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold text-white mb-2 mt-3">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-8">$1</h1>')

    // Horizontal rules
    .replace(/^---$/gim, '<hr class="border-white/20 my-6">')

    // Code blocks (must be processed before inline code)
    .replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      '<pre class="bg-black/40 rounded-lg p-4 my-4 overflow-x-auto border border-white/10"><code class="text-green-300 text-sm font-mono whitespace-pre">$2</code></pre>'
    )

    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-2 py-1 rounded text-sm font-mono text-blue-300">$1</code>')

    // Bold and Italic (process before links)
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-white/90">$1</em>')

    // Links (fixed regex pattern)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    )

  // Process content line by line for better control
  const lines = html.split('\n')
  let processedLines: string[] = []
  let inList = false
  let listItems: string[] = []
  let inTable = false
  let tableRows: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isListItem = /^[\s]*[*-]\s+(.*)$/.test(line)
    const isTableRow = /^\|(.+)\|$/.test(line)
    const isTableSeparator = /^\|[\s-:|]+\|$/.test(line)
    
    if (isTableRow && !isTableSeparator) {
      if (!inTable) {
        inTable = true
        tableRows = []
      }
      // Process table row
      const content = line.replace(/^\||\|$/g, '')
      const cells = content.split('|').map((cell: string) => cell.trim())
      const cellsHtml = cells.map((cell: string) => 
        `<td class="px-3 py-2 border border-white/10 text-white">${cell}</td>`
      ).join('')
      tableRows.push(`<tr>${cellsHtml}</tr>`)
    } else if (isTableSeparator) {
      // Skip table separator lines
      continue
    } else {
      // End table if we were in one
      if (inTable) {
        processedLines.push(`<table class="w-full border-collapse border border-white/10 my-4 rounded-lg overflow-hidden"><tbody>${tableRows.join('')}</tbody></table>`)
        tableRows = []
        inTable = false
      }

      // Handle lists
      if (isListItem) {
        if (!inList) {
          inList = true
          listItems = []
        }
        const match = line.match(/^[\s]*[*-]\s+(.*)$/)
        if (match) {
          listItems.push(`<li class="text-white mb-1 ml-4">${match[1]}</li>`)
        }
      } else {
        if (inList) {
          // End of list, process accumulated items
          processedLines.push(`<ul class="list-disc list-outside space-y-1 mb-4 ml-4">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processedLines.push(line)
      }
    }
  }

  // Handle case where document ends with a table
  if (inTable) {
    processedLines.push(`<table class="w-full border-collapse border border-white/10 my-4 rounded-lg overflow-hidden"><tbody>${tableRows.join('')}</tbody></table>`)
  }

  // Handle case where document ends with a list
  if (inList) {
    processedLines.push(`<ul class="list-disc list-outside space-y-1 mb-4 ml-4">${listItems.join('')}</ul>`)
  }

  html = processedLines.join('\n')

  // Handle paragraphs - split by double newlines first
  const paragraphs = html.split(/\n\s*\n/)
  const processedParagraphs: string[] = []

  for (const paragraph of paragraphs) {
    const lines = paragraph.split('\n')
    const processedLines: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip empty lines
      if (!trimmed) {
        processedLines.push('')
        continue
      }
      
      // Skip lines that are already HTML elements
      if (trimmed.startsWith('<') && (trimmed.includes('</') || trimmed.endsWith('>'))) {
        processedLines.push(line)
        continue
      }
      
      // This is plain text that needs proper styling
      if (!trimmed.startsWith('<')) {
        processedLines.push(`<span class="text-white/90">${line}</span>`)
      } else {
        processedLines.push(line)
      }
    }
    
    // Join lines within a paragraph and wrap in paragraph tags if it contains non-HTML content
    const joinedLines = processedLines.join('<br>')
    if (joinedLines.trim() && !joinedLines.trim().startsWith('<h') && !joinedLines.trim().startsWith('<ul') && !joinedLines.trim().startsWith('<table') && !joinedLines.trim().startsWith('<pre') && !joinedLines.trim().startsWith('<hr')) {
      processedParagraphs.push(`<p class="leading-relaxed mb-4">${joinedLines}</p>`)
    } else {
      processedParagraphs.push(joinedLines)
    }
  }
  
  return processedParagraphs.join('\n\n')
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
