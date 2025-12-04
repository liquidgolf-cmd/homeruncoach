import React from 'react'

interface DraftActionsProps {
  draftContent: string
  moduleType: 'story' | 'solution' | 'success'
  onSave?: () => void
}

const DraftActions: React.FC<DraftActionsProps> = ({ draftContent, moduleType, onSave }) => {
  const handleDownload = () => {
    const moduleNames = {
      story: 'Story',
      solution: 'Solution',
      success: 'Success',
    }
    const moduleTitles = {
      story: 'Brand Story, Ideal Client Profile & Core Message',
      solution: 'Value Proposition, Offer & Customer Journey',
      success: 'Success Outcomes, Metrics & Action Plan',
    }
    const filename = `${moduleNames[moduleType]}-Draft-${new Date().toISOString().split('T')[0]}.txt`
    
    // Format content with clear headers for download
    const formattedContent = `HOME RUN COACH AI - ${moduleNames[moduleType]} MODULE DRAFT
Generated: ${new Date().toLocaleDateString()}

${'='.repeat(60)}

${draftContent}

${'='.repeat(60)}
Document: ${moduleTitles[moduleType]}
`
    
    const blob = new Blob([formattedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Convert markdown-style formatting to HTML for better printing
    let formattedContent = draftContent
      // Convert headers
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      // Convert bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(para => {
        // Don't wrap headers in paragraphs
        if (para.trim().startsWith('<h') || para.trim().startsWith('##')) {
          return para.trim().replace(/^## (.+)$/gm, '<h2>$1</h2>')
        }
        // Wrap regular paragraphs
        return `<p>${para.trim().replace(/\n/g, '<br>')}</p>`
      })
      .join('\n')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Draft - ${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} Module</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            h2 {
              font-size: 20px;
              margin-top: 30px;
              margin-bottom: 15px;
              color: #000;
            }
            h3 {
              font-size: 18px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 12px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              h2 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} Module Draft</h1>
          <div>${formattedContent}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      // Default: save to localStorage
      const draftKey = `homeruncoach_draft_${moduleType}_${Date.now()}`
      localStorage.setItem(draftKey, JSON.stringify({
        content: draftContent,
        moduleType,
        savedAt: new Date().toISOString(),
      }))
      alert('Draft saved!')
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2 flex-wrap">
      <button
        onClick={handleSave}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
      >
        💾 Save
      </button>
      <button
        onClick={handleDownload}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
      >
        ⬇️ Download
      </button>
      <button
        onClick={handlePrint}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
      >
        🖨️ Print
      </button>
    </div>
  )
}

export default DraftActions

