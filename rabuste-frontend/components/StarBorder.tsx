import React from 'react';
import './StarBorder.css';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'div'>({
  as,
  className = '',
  children,
  color = '#3B2B23',
  speed = '6s',
  thickness = 1,
  ...rest
}: StarBorderProps<T>) => {
  const Component: any = as || 'div';

  const isOrigin = className.includes('star-border-origin');
  const originInnerStyle: React.CSSProperties | undefined = isOrigin
    ? {
        background: 'rgba(59,43,35,0.94)', // dark coffee
        color: '#FAD0C4', // cream text
        padding: '12px 28px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.03)',
        boxShadow: '0 18px 50px rgba(12,8,6,0.55)',
        zIndex: 2,
      }
    : undefined;

  return (
    <Component
      className={`star-border-container ${className}`}
      {...rest}
      // ensure positioned inline-flex unless caller overrides
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...((rest as any).style || {}) }}
    >
      {/* decorative gradients (kept low-opacity so they don't cover content) */}
      <span className="border-gradient-top" style={{ animationDuration: speed, borderWidth: thickness }} aria-hidden />
      <span className="border-gradient-bottom" style={{ animationDuration: speed, borderWidth: thickness }} aria-hidden />

      {/* the visible content area */}
      <div className="inner-content" style={{ ...(originInnerStyle || {} ) }}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
