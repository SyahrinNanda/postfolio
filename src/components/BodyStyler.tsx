'use client';
import { useEffect, useMemo } from 'react';

interface BodyStylerProps {
  classes?: string[];
  attributes?: Record<string, string>;
}

export default function BodyStyler({ classes = [], attributes = {} }: BodyStylerProps) {
  const classesKey = useMemo(() => classes.join(' '), [classes]);
  const attributesKey = useMemo(() => JSON.stringify(attributes), [attributes]);

  useEffect(() => {
    const list = classesKey.split(' ').filter(Boolean);
    if (list.length > 0) {
      document.body.classList.add(...list);
    }

    const attrs = JSON.parse(attributesKey) as Record<string, string>;
    Object.entries(attrs).forEach(([key, value]) => {
      document.body.setAttribute(key, value);
    });

    return () => {
      if (list.length > 0) {
        document.body.classList.remove(...list);
      }

      Object.keys(attrs).forEach((key) => {
        document.body.removeAttribute(key);
      });
    };
  }, [classesKey, attributesKey]);

  return null;
}
