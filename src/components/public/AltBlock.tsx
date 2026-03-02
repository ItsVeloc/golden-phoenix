interface AltBlockProps {
  id?: string;
  reverse?: boolean;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function AltBlock({
  id,
  reverse,
  image,
  imageAlt,
  title,
  description,
  buttonText,
  buttonHref,
}: AltBlockProps) {
  return (
    <div className={`alt-block${reverse ? ' reverse' : ''}`} id={id}>
      <div className="alt-image reveal">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="alt-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {buttonText && buttonHref && (
          <a href={buttonHref} className="btn-outline">{buttonText}</a>
        )}
      </div>
    </div>
  );
}
