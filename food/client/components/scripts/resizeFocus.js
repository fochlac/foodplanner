const resizeHandler = () => {
    document.activeElement.scrollIntoViewIfNeeded();
};

export const resizeFocus = () => window.addEventListener('resize', resizeHandler);

export const removeResizeFocus = () => window.removeEventListener('resize', resizeHandler);