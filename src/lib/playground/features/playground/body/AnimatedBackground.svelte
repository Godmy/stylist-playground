<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();
</script>

<style>
  /* ================================
     Ambient Animated Background
     Pure CSS/SVG, no JS
     ================================ */

  :root {
    --orange-1: #FF3E00;
    --orange-2: #FF6B35;
    --red-1: #EF4444;

    /* opacity tuning for light mode */
    --wash-opacity: 0.12;
    --shape-opacity: 0.12;
    --orb-opacity: 0.12;
    --particle-opacity: 0.25;

    --blur-strong: 80px;
    --blur-soft: 40px;
  }

  :global(.dark) {
    /* lower intensity on dark backgrounds */
    --wash-opacity: 0.08;
    --shape-opacity: 0.09;
    --orb-opacity: 0.10;
    --particle-opacity: 0.18;
  }

  .ambient-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background: transparent;
    isolation: isolate;
  }

  /* Soft gradient wash */
  .ambient-bg__wash {
    position: absolute;
    inset: -10%;
    background:
      radial-gradient(60vmax 60vmax at 10% 10%, color-mix(in oklab, var(--orange-2) 70%, transparent) 0%, transparent 60%),
      radial-gradient(70vmax 70vmax at 90% 20%, color-mix(in oklab, var(--red-1) 70%, transparent) 0%, transparent 62%),
      radial-gradient(80vmax 80vmax at 50% 100%, color-mix(in oklab, var(--orange-1) 60%, transparent) 0%, transparent 65%);
    opacity: var(--wash-opacity);
    filter: blur(var(--blur-strong)) saturate(1.1);
    transform: translateZ(0);
    animation: wash-drift 26s ease-in-out infinite alternate;
  }

  /* Large semi-transparent blurred shapes */
  .ambient-bg__shape {
    position: absolute;
    width: 48vmax;
    height: 48vmax;
    border-radius: 999px;
    opacity: var(--shape-opacity);
    filter: blur(var(--blur-strong));
    mix-blend-mode: screen;
    transform: translateZ(0);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation:
      shape-drift 22s linear infinite,
      shape-breathe 8s ease-in-out infinite;
  }

  .ambient-bg__shape.s1 {
    top: -10vmax;
    left: -8vmax;
    background: radial-gradient(circle at 30% 30%, rgba(255, 107, 53, 0.15), transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(255, 62, 0, 0.12), transparent 65%);
    animation-duration: 28s, 9s;
  }

  .ambient-bg__shape.s2 {
    top: 10vmax;
    right: -12vmax;
    width: 55vmax;
    height: 55vmax;
    background: radial-gradient(circle at 35% 35%, rgba(239, 68, 68, 0.14), transparent 60%),
                radial-gradient(circle at 75% 25%, rgba(255, 62, 0, 0.10), transparent 62%);
    animation-duration: 24s, 7.5s;
    animation-direction: reverse, alternate;
  }

  .ambient-bg__shape.s3 {
    bottom: -18vmax;
    left: 20vmax;
    width: 60vmax;
    height: 40vmax;
    border-radius: 28vmax;
    background: radial-gradient(ellipse at 40% 50%, rgba(255, 107, 53, 0.12), transparent 65%),
                radial-gradient(ellipse at 80% 60%, rgba(239, 68, 68, 0.10), transparent 70%);
    animation-duration: 30s, 10s;
  }

  /* Glowing orbs */
  .ambient-bg__orb {
    position: absolute;
    border-radius: 999px;
    opacity: var(--orb-opacity);
    filter: blur(var(--blur-soft));
    transform: translateZ(0);
    mix-blend-mode: screen;
    animation:
      orb-float 18s linear infinite,
      orb-breathe 6s ease-in-out infinite;
  }

  /* Individual orb sizes/starts for parallax */
  .ambient-bg__orb.o1 {
    width: 18vmax; height: 18vmax;
    top: 12%; left: 8%;
    background: radial-gradient(circle, rgba(255, 62, 0, 0.15) 0%, transparent 65%);
    animation-duration: 26s, 7s;
  }
  .ambient-bg__orb.o2 {
    width: 12vmax; height: 12vmax;
    top: 55%; left: 18%;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.14) 0%, transparent 68%);
    animation-duration: 20s, 6s;
  }
  .ambient-bg__orb.o3 {
    width: 22vmax; height: 22vmax;
    top: 25%; right: 10%;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.14) 0%, transparent 70%);
    animation-duration: 30s, 8.5s;
  }
  .ambient-bg__orb.o4 {
    width: 10vmax; height: 10vmax;
    bottom: 18%; right: 22%;
    background: radial-gradient(circle, rgba(255, 62, 0, 0.12) 0%, transparent 70%);
    animation-duration: 17s, 5.5s;
  }
  .ambient-bg__orb.o5 {
    width: 14vmax; height: 14vmax;
    bottom: 8%; left: 52%;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.12) 0%, transparent 72%);
    animation-duration: 23s, 7.5s;
  }

  /* Small particles */
  .ambient-bg__particles {
    position: absolute;
    inset: 0;
  }

  .ambient-bg__particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    opacity: var(--particle-opacity);
    background: radial-gradient(circle, rgba(255, 107, 53, 0.35) 0%, transparent 70%);
    filter: blur(2px);
    transform: translateZ(0);
    animation:
      particle-drift 16s linear infinite,
      particle-fade 5.5s ease-in-out infinite;
  }

  /* Particle placement + random-ish timings */
  .ambient-bg__particle.p0  { top: 10%; left: 20%; animation-duration: 18s, 6s; }
  .ambient-bg__particle.p1  { top: 25%; left: 70%; animation-duration: 22s, 5s; }
  .ambient-bg__particle.p2  { top: 45%; left: 35%; animation-duration: 16s, 7s; }
  .ambient-bg__particle.p3  { top: 60%; left: 80%; animation-duration: 20s, 6.5s; }
  .ambient-bg__particle.p4  { top: 75%; left: 15%; animation-duration: 24s, 5.5s; }
  .ambient-bg__particle.p5  { top: 82%; left: 55%; animation-duration: 19s, 6.2s; }
  .ambient-bg__particle.p6  { top: 14%; left: 52%; animation-duration: 25s, 7.2s; }
  .ambient-bg__particle.p7  { top: 33%; left: 8%;  animation-duration: 17s, 5.8s; }
  .ambient-bg__particle.p8  { top: 52%; left: 62%; animation-duration: 21s, 6.7s; }
  .ambient-bg__particle.p9  { top: 68%; left: 42%; animation-duration: 15s, 5.2s; }
  .ambient-bg__particle.p10 { top: 7%;  left: 88%; animation-duration: 23s, 6.9s; }
  .ambient-bg__particle.p11 { top: 90%; left: 90%; animation-duration: 26s, 7.5s; }

  /* Subtle geometric SVG overlay */
  .ambient-bg__geo {
    position: absolute;
    inset: -5%;
    opacity: 0.6;
    filter: blur(1px);
    transform: translateZ(0);
    animation: geo-drift 28s ease-in-out infinite alternate;
  }

  /* Ensure main content is above background */
  .playground-welcome {
    position: relative;
    z-index: 1;
  }

  /* ================================
     Keyframes
     ================================ */

  @keyframes wash-drift {
    0%   { transform: translate3d(-2%, -1%, 0) scale(1); }
    100% { transform: translate3d( 2%,  1%, 0) scale(1.03); }
  }

  @keyframes shape-drift {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(3vmax, -2vmax, 0); }
    100% { transform: translate3d(-2vmax, 2vmax, 0); }
  }

  @keyframes shape-breathe {
    0%, 100% { opacity: calc(var(--shape-opacity) * 0.9); }
    50%      { opacity: calc(var(--shape-opacity) * 1.15); }
  }

  @keyframes orb-float {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(6vmax, -4vmax, 0); }
    100% { transform: translate3d(-4vmax, 5vmax, 0); }
  }

  @keyframes orb-breathe {
    0%, 100% { opacity: calc(var(--orb-opacity) * 0.85); }
    50%      { opacity: calc(var(--orb-opacity) * 1.2); }
  }

  @keyframes particle-drift {
    0%   { transform: translate3d(0, 0, 0) scale(1); }
    100% { transform: translate3d(10vmax, -8vmax, 0) scale(1.05); }
  }

  @keyframes particle-fade {
    0%, 100% { opacity: calc(var(--particle-opacity) * 0.6); }
    50%      { opacity: calc(var(--particle-opacity) * 1.0); }
  }

  @keyframes geo-drift {
    0%   { transform: translate3d(0, 0, 0) scale(1); }
    100% { transform: translate3d(-1.5%, 1%, 0) scale(1.02); }
  }

  /* Optional reduced-motion support */
  @media (prefers-reduced-motion: reduce) {
    .ambient-bg__wash,
    .ambient-bg__shape,
    .ambient-bg__orb,
    .ambient-bg__particle,
    .ambient-bg__geo {
      animation: none !important;
    }
  }
</style>

<!-- AnimatedBackground.svelte -->
<div class="ambient-bg" aria-hidden="true">
  <!-- soft gradient wash -->
  <div class="ambient-bg__wash"></div>

  <!-- big blurred shapes -->
  <div class="ambient-bg__shape s1"></div>
  <div class="ambient-bg__shape s2"></div>
  <div class="ambient-bg__shape s3"></div>

  <!-- glowing orbs -->
  <div class="ambient-bg__orb o1"></div>
  <div class="ambient-bg__orb o2"></div>
  <div class="ambient-bg__orb o3"></div>
  <div class="ambient-bg__orb o4"></div>
  <div class="ambient-bg__orb o5"></div>

  <!-- tiny drifting particles -->
  <div class="ambient-bg__particles">
    {#each Array(12) as _, i}
      <span class="ambient-bg__particle p{i}"></span>
    {/each}
  </div>

  <!-- OPTIONAL: subtle geometric overlay via SVG -->
  <svg class="ambient-bg__geo" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <radialGradient id="g1" cx="30%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#FF6B35" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#FF3E00" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g2" cx="70%" cy="70%" r="65%">
        <stop offset="0%" stop-color="#EF4444" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="20" cy="15" r="18" fill="url(#g1)"/>
    <circle cx="78" cy="72" r="22" fill="url(#g2)"/>
  </svg>
</div>

<!-- Your content should sit above this -->
<div class="playground-welcome">
  {#if children}
    {@render children()}
  {/if}
</div>

