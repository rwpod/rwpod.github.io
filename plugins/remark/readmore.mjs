import { findAndReplace } from 'mdast-util-find-and-replace'
import { toMarkdown } from 'mdast-util-to-markdown'
import { filter } from 'unist-util-filter'
import { remove } from 'unist-util-remove'
import { marked } from 'marked'
import { convert } from 'html-to-text'

const SEPARATOR = 'READMORE'

marked.setOptions({
  gfm: true,
  smartypants: true
})

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

const squeezeParagraphs = (tree) => (
  remove(tree, { cascade: false }, (node) =>
    Boolean(
      node.type === 'paragraph' &&
      node.children.every(
        (node) => node.type === 'text' && /^\s*$/.test(node.value)
      )
    ))
)

const readmoreRemarkPlugin = () => (tree, file) => {
  const summaryHTML = marked.parse(toMarkdown(getTreeSummary(tree)))
  file.data.astro.frontmatter.summaryHTML = summaryHTML
  file.data.astro.frontmatter.summaryText = convert(summaryHTML)
  // remove separator
  squeezeParagraphs(findAndReplace(tree, SEPARATOR))
}

export default readmoreRemarkPlugin
