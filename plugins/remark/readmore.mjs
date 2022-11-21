import { findAndReplace } from 'mdast-util-find-and-replace'
// import { squeezeParagraphs } from 'mdast-util-squeeze-paragraphs'
import { toMarkdown } from 'mdast-util-to-markdown'
import { filter } from 'unist-util-filter'
import { marked } from 'marked'
import { convert } from 'html-to-text'

const SEPARATOR = 'READMORE'

const getTreeSummary = (tree) => {
  let isSummaryDone = false
  return filter(tree, (node) => {
    if (node.type === 'text' && node.value === SEPARATOR) {
      isSummaryDone = true
      return false
    }
    return !isSummaryDone
  })
}

const readmoreRemarkPlugin = () => (tree, file) => {
  const summaryText = convert(marked.parse(toMarkdown(getTreeSummary(tree))))
  file.data.astro.frontmatter.summaryText = summaryText
  // squeezeParagraphs(findAndReplace(tree, SEPARATOR))
  findAndReplace(tree, SEPARATOR)
}

export default readmoreRemarkPlugin
