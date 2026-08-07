/**
 * File: client/src/components/HcLogo.jsx
 * Description: Official logo component for HireCore OS rendering public/logo.png
 *              with flexible sizing and crisp object styling.
 */

const HcLogo = ({ className = "h-8 w-8", alt = "HireCore OS Logo", ...props }) => {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  );
};

export default HcLogo;
