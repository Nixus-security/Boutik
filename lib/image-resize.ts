/**
 * Redimensionne une image côté navigateur et renvoie un data URL léger, prêt à être intégré
 * dans le catalogue. En JPEG par défaut (bien plus léger que le PNG pour des photos), sauf
 * pour le format "png" qui préserve la transparence (utile pour un logo).
 */
export async function fileToResizedDataUrl(
  file: File,
  maxSize = 200,
  format: "jpeg" | "png" = "jpeg"
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Image invalide"));
    el.src = dataUrl;
  });

  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = Math.round(height * (maxSize / width));
    width = maxSize;
  } else if (height >= width && height > maxSize) {
    width = Math.round(width * (maxSize / height));
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté sur cet appareil");

  if (format === "jpeg") {
    // le JPEG n'a pas de canal alpha : fond blanc pour éviter un aplat noir
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  return format === "jpeg" ? canvas.toDataURL("image/jpeg", 0.85) : canvas.toDataURL("image/png");
}
