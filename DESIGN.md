# Design Guide

This document outlines the design tokens used in the application. Design tokens are the fundamental visual design attributes, represented as named values. Using tokens allows for a consistent and maintainable design system.

> Original design is https://dribbble.com/shots/20508222-Chatbox-Message-Dashboard

## Color

Colors are defined as named variables.

| Token Name       | Value     | Description                                |
| ---------------- | --------- | ------------------------------------------ |
| `primary`        | `#4F46E5` | Main brand color                           |
| `secondary`      | `#6B7280` | Secondary brand color                      |
| `background`     | `#F9FAFB` | Main application background                |
| `card`           | `#FFFFFF` | Background color for cards or containers   |
| `text-primary`   | `#1F2937` | Color for primary text                     |
| `text-secondary` | `#6B7280` | Color for secondary or less important text |

## Typography

Define font families, sizes, weights, and line heights.

| Token Name           | Value                                                                                                                                                                                                                                      | Description         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `font-family-sans`   | `['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji']` | Default font family |
| `font-size-base`     | `1rem` (16px)                                                                                                                                                                                                                              | Base font size      |
| `font-weight-medium` | `500`                                                                                                                                                                                                                                      | Medium font weight  |
| `font-weight-bold`   | `700`                                                                                                                                                                                                                                      | Bold font weight    |
| `line-height-normal` | `1.5`                                                                                                                                                                                                                                      | Normal line height  |

## Spacing

Define spacing values.

| Token Name | Value           | Description    |
| ---------- | --------------- | -------------- |
| `space-0`  | `0`             | No space       |
| `space-2`  | `0.5rem` (8px)  | 2 unit spacing |
| `space-4`  | `1rem` (16px)   | 4 unit spacing |
| `space-6`  | `1.5rem` (24px) | 6 unit spacing |
| `space-8`  | `2rem` (32px)   | 8 unit spacing |

## Borders

Define border radii.

| Token Name         | Value            | Description          |
| ------------------ | ---------------- | -------------------- |
| `border-radius-md` | `0.375rem` (6px) | Medium border radius |

## Shadows

Define shadow styles.

| Token Name  | Value                                                                  | Description   |
| ----------- | ---------------------------------------------------------------------- | ------------- |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | Medium shadow |
