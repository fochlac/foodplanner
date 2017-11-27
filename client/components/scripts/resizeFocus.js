const resizeHandler = () => {
    document.activeElement.scrollIntoView();
};

export const resizeFocus = () => window.addEventListener('resize', resizeHandler);

export const removeResizeFocus = () => window.removeEventListener('resize', resizeHandler);