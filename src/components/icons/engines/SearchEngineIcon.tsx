import type { ComponentType } from 'react';
import type { IconProps } from '../types';
import type { SearchEngineId } from '@/types';
import { GoogleIcon } from './GoogleIcon';
import { DuckDuckGoIcon } from './DuckDuckGoIcon';
import { BraveIcon } from './BraveIcon';
import { BingIcon } from './BingIcon';
import { ChatGPTIcon } from './ChatGPTIcon';
import { YandexIcon } from './YandexIcon';
import { GerdooIcon } from './GerdooIcon';
import { GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/util';

const SEARCH_ENGINE_ICONS: Record<
  SearchEngineId,
  ComponentType<IconProps>
> = {
  google: GoogleIcon,
  duckduckgo: DuckDuckGoIcon,
  brave: BraveIcon,
  bing: BingIcon,
  chatgpt: ChatGPTIcon,
  yandex: YandexIcon,
  gerdoo: GerdooIcon,
};

export interface SearchEngineIconProps extends IconProps {
  engineId: SearchEngineId | string;
}

export function SearchEngineIcon({
  engineId,
  className,
  ...props
}: SearchEngineIconProps) {
  const IconComponent =
    SEARCH_ENGINE_ICONS[engineId as SearchEngineId] ?? null;

  if (IconComponent) {
    return <IconComponent className={className} {...props} />;
  }

  return (
    <GlobeIcon
      className={cn('size-4 text-muted-foreground', className)}
      {...(props as React.ComponentProps<typeof GlobeIcon>)}
    />
  );
}

export default SearchEngineIcon;
