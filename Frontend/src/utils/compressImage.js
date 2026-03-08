// utils/compressImage.js
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const img = document.createElement("img")
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        const compressed = new File([blob], file.name, { type: "image/jpeg" })
        URL.revokeObjectURL(url)
        resolve(compressed)
      }, "image/jpeg", quality)
    }
    img.src = url
  })
}