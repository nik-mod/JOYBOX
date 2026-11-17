import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

export const allowMotion = '(prefers-reduced-motion: no-preference)';
export const wideMotion = '(min-width: 900px) and (pointer: fine) and ' + allowMotion;
export const editorialEase = 'power3.out';

export { gsap, useGSAP, ScrollTrigger };
