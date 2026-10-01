"use client";

import { cloneElement, createElement, Fragment, isValidElement, ReactNode } from "react";
import { translateText } from "@/data/translations";
import { useLanguage } from "@/features/preferences/language-context";

const translatedAttributes = new Set([
  "aria-label", "aria-description", "aria-placeholder", "placeholder", "title", "label", "hint", "description", "intro"
]);

function translateTree(node: ReactNode, language: ReturnType<typeof useLanguage>["language"]): ReactNode {
  if (typeof node === "string") return translateText(node, language);
  if (Array.isArray(node)) return node.map((child) => translateTree(child, language));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;

  // Pass translated child copy through React components; components with internal copy add their own boundary.
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.props)) {
    if (key === "children") continue;
    if (translatedAttributes.has(key) && typeof value === "string") props[key] = translateText(value, language);
    else props[key] = value;
  }

  const children = node.props.children;
  if (children === undefined) return cloneElement(node, props);

  // Static sibling children (`<p>Sold by <span/></p>`) must be passed as separate arguments, exactly like JSX
  // does. Passing them as one array makes React treat them as a list and warn about missing "key" props.
  // Real lists (arrays produced by .map()) stay arrays inside those arguments and keep their own keys.
  const translated = Array.isArray(children)
    ? children.map((child) => translateTree(child, language))
    : [translateTree(children, language)];
  return cloneElement(node, props, ...translated);
}

export function Localized({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const translated = Array.isArray(children)
    ? children.map((child) => translateTree(child, language))
    : [translateTree(children, language)];
  return createElement(Fragment, null, ...translated);
}
