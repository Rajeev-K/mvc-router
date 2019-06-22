/**
 * Returns coordinates relative to document.
 */
export function getOffset(el: HTMLElement): { left: number, top: number } {
    const rect = el.getBoundingClientRect();

    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
    };
}

/**
 * Checks if supplied element is visible, based on its (and its ancestors') style settings.
 */
export function isVisible(el: HTMLElement): boolean {
    if (!el) {
        return false;
    }
    const style = window.getComputedStyle(el);
    return style.display !== 'none';
}
