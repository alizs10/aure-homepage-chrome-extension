import type { IconProps } from '../types';
import { cn } from '@/lib/util';

export function YandexIcon({
  className,
  size,
  width = size,
  height = size,
  fill = '#FC3F1D',
  viewBox = '0 0 24 24',
  'aria-hidden': ariaHidden,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox={viewBox}
      fill={fill}
      width={width}
      height={height}
      className={cn('size-4', className)}
      aria-hidden={ariaHidden ?? (props['aria-label'] ? undefined : true)}
      {...props}
    >
      <path d="M16.376 12.644L21 2h-3.842l-4.624 10.644h3.842zM13.915 24v-3.733c0-2.822-.352-3.64-1.407-5.988L6.933 2H3l7.124 15.709V24h3.79z" />
    </svg>
  );
}

export default YandexIcon;
