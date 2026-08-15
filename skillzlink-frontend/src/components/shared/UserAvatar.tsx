interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
}

/**
 * Avatar that always renders an image — either the user's uploaded picture
 * or a person-silhouette placeholder. Never falls back to initials/letters.
 */
export function UserAvatar({ src, name = "", size = 32, className = "" }: UserAvatarProps) {
  const style = { width: size, height: size };
  const alt = name || "User";

  if (src && src.length > 0) {
    return (
      <img
        src={src}
        alt={alt}
        style={style}
        className={`rounded-full object-cover shrink-0 bg-[var(--bg-secondary)] ${className}`}
      />
    );
  }

  const silhouette = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  );

  return (
    <img
      src={`data:image/svg+xml;utf8,${silhouette}`}
      alt={alt}
      style={style}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
}

export default UserAvatar;
