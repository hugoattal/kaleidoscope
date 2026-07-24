<template>
    <div
        aria-hidden="true"
        class="gradient"
    />
</template>

<style scoped>
.gradient {
  --gradient-base: #030100;
  --gradient-amber: rgb(181 53 4 / 85%);
  --gradient-copper: rgb(111 30 3 / 65%);
  --gradient-glow: rgb(134 41 6 / 55%);

  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: var(--gradient-base);

  &::before,
  &::after {
    position: absolute;
    inset: -30%;
    content: '';
    will-change: transform, opacity;
  }

  &::before {
    background:
      radial-gradient(
        circle at 82% 18%,
        var(--gradient-amber) 0,
        var(--gradient-copper) 18%,
        transparent 43%
      ),
      radial-gradient(
        circle at 16% 78%,
        var(--gradient-glow) 0,
        transparent 35%
      );
    filter: blur(18px);
    animation: drift-primary 28s ease-in-out infinite alternate;
  }

  &::after {
    background:
      radial-gradient(
        ellipse at 48% 42%,
        rgb(77 19 2 / 35%) 0,
        transparent 48%
      );
    filter: blur(30px);
    animation: drift-secondary 36s ease-in-out infinite alternate;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
}

@keyframes drift-primary {
  0% {
    transform: translate3d(-5%, -3%, 0) scale(1);
  }

  50% {
    transform: translate3d(4%, 5%, 0) scale(1.08) rotate(3deg);
  }

  100% {
    transform: translate3d(-2%, 8%, 0) scale(1.14) rotate(-2deg);
  }
}

@keyframes drift-secondary {
  0% {
    opacity: 0.6;
    transform: translate3d(8%, -6%, 0) scale(1.08);
  }

  100% {
    opacity: 1;
    transform: translate3d(-10%, 7%, 0) scale(1.25);
  }
}
</style>
