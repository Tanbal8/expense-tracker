const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    e.target.style.opacity = '0.5';
}

const onDragOver = (e) => {
    e.preventDefault();
}

const onDragEnd = (e, id) => {
    e.target.style.opacity = '';
}

const onDrop = (e, id, callback = () => {}) => {
    e.preventDefault();
    const fromId = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromId === id) return;
    callback(fromId, id);
}

export {
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
}