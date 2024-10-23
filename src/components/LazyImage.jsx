import { useEffect, useRef } from "react"

const LazyImage = ({ src, alt, className, srcSet, sizes }) => {
  // useRef permet de conserver une référence mutable pour l'élément <img>
  const imgRef = useRef()

  useEffect(() => {
    // Récupération de la référence de l'élément image
    const img = imgRef.current

    // Création d'un observateur d'intersection pour détecter quand l'image entre dans le viewport
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // Vérifie si l'image est entrée dans le viewport
          if (entry.isIntersecting) {
            // Charge l'image en mettant à jour l'attribut `src` avec `data-src`
            img.src = img.dataset.src // Charge l'image lorsqu'elle est proche du viewport
            // Arrête d'observer l'image une fois qu'elle a été chargée
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: "400px", // Précharge l'image lorsqu'elle est à 400px du viewport
        threshold: 0,
      }
    )

    // Lance l'observation de l'élément image
    observer.observe(img)

    // Nettoyage de l'observation lorsque le composant est démonté ou lorsque l'image a été chargée
    return () => {
      if (img) observer.unobserve(img)
    }
  }, [])

  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      className={className}
      srcSet={srcSet}
      sizes={sizes}
    />
  )
}

export default LazyImage
