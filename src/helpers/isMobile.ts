export function isMobile(): boolean {
  // tailwindcss lg breakpoint
  const isMobile = window.innerWidth < 1024;
  return isMobile;
}
