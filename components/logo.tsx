import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "leaf" | "sprout" | "circle" | "organic";
}

const Logo = ({ className = "", size = "md", variant = "leaf" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const renderLeafLogo = () => (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple leaf with clean lines */}
      <path
        className="drop-shadow-sm"
        d="M20 2C28 2 36 8 36 18C36 28 28 34 20 38C12 34 4 28 4 18C4 8 12 2 20 2Z"
        fill="hsl(var(--fresh-green))"
      />
      <path
        d="M20 4L20 36"
        opacity="0.8"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M20 12L12 18M20 18L28 24M20 24L12 30"
        opacity="0.6"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );

  const renderSproutLogo = () => (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Minimalist sprout design */}
      <path
        d="M20 35L20 15"
        stroke="hsl(var(--fresh-green))"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle
        cx="15"
        cy="12"
        fill="hsl(var(--fresh-green))"
        opacity="0.9"
        r="8"
      />
      <circle
        cx="25"
        cy="10"
        fill="hsl(var(--fresh-green))"
        opacity="0.7"
        r="6"
      />
      <circle cx="20" cy="36" fill="hsl(var(--fresh-green))" r="2" />
    </svg>
  );

  const renderCircleLogo = () => (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clean circular design */}
      <circle
        className="drop-shadow-sm"
        cx="20"
        cy="20"
        fill="hsl(var(--fresh-green))"
        r="18"
      />
      <path
        d="M12 12C16 8 24 8 28 12C24 16 16 16 12 12Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M12 28C16 32 24 32 28 28C24 24 16 24 12 28Z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="20" cy="20" fill="white" r="3" />
    </svg>
  );

  const renderOrganicLogo = () => (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Organic flowing design */}
      <path
        className="drop-shadow-sm"
        d="M8 20C8 12 14 6 20 8C26 6 32 12 32 20C32 28 26 34 20 32C14 34 8 28 8 20Z"
        fill="hsl(var(--fresh-green))"
      />
      <path
        d="M20 12C18 14 16 18 20 20C24 18 22 14 20 12Z"
        fill="white"
        opacity="0.8"
      />
      <path
        d="M20 28C22 26 24 22 20 20C16 22 18 26 20 28Z"
        fill="white"
        opacity="0.8"
      />
    </svg>
  );

  const logoVariants = {
    leaf: renderLeafLogo,
    sprout: renderSproutLogo,
    circle: renderCircleLogo,
    organic: renderOrganicLogo,
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {logoVariants[variant]()}
    </div>
  );
};

export default Logo;
