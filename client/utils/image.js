export function resize(file, maxDimensions) {
    return new Promise((resolve, reject) => {
        let maxWidth  = maxDimensions.width,
            maxHeight = maxDimensions.height;

        if (!file.type.match(/image.*/)) {
            return reject();
        }

        let image = document.createElement('img');

        image.onload = (imgEvt) => {
            let width  = image.width,
                height = image.height,
                isTooLarge = false;

            if (width >= height && width > maxDimensions.width) {
                height *= maxDimensions.width / width;
                width = maxDimensions.width;
                isTooLarge = true;
            } else if (height > maxDimensions.height) {
                width *= maxDimensions.height / height;
                height = maxDimensions.height;
                isTooLarge = true;
            }

            if (!isTooLarge) {
                return resolve(file);
            }

            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            let ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, {type: file.type}));
            }, file.type);
        };

        image.src = URL.createObjectURL(file);
    })
}