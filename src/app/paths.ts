export const normalizePath = (path: string) => {
  try {
    return decodeURIComponent(path).replace(/\/+$/, "") + "/"
  } catch {
    return path.replace(/\/+$/, "") + "/"
  }
}
