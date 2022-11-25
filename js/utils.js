export function renderTemplate(template) {
    const content = document.getElementById("view")
    if (!content) {
      throw Error("No Element found for provided content id")
    }
    content.innerHTML = ""
    content.append(template)
}

export async function loadHtml(page) {
    const resHtml = await fetch(page).then(r => {
      if (!r.ok) {
        throw new Error(`Failed to load the page: '${page}' `)
      }
      return r.text()
    });
    const parser = new DOMParser()
    const content = parser.parseFromString(resHtml, "text/html")
    const div = content.querySelector(".template")
    if (!div) {
      throw new Error(`No outer div with class 'template' found in file '${page}'`)
    }
    return div
}

export async function fetching() {
    !{notImplemented};
}