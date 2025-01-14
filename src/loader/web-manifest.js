const {urlToRequest} = require('loader-utils')

const {createResolve} = require('./util.js')

module.exports = function webManifestLoader (manifestJson) {
  const callback = this.async()

  main(this, manifestJson).then(
    result => callback(null, result),
    error => callback(error),
  )
}

async function main (loader, manifestJson) {
  loader.cacheable()
  const resolve = createResolve(loader)

  const manifest = JSON.parse(manifestJson)
  const {icons = [], screenshots = []} = manifest
  const images = [...icons, ...screenshots]

  await Promise.all(images.map(image => resolveImage(resolve, image)))

  return JSON.stringify(manifest)
}

async function resolveImage (resolve, image) {
  image.src = await resolve(urlToRequest(image.src))
}
